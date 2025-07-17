#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use reqwest::Url;
use semver::Version;
use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;
use tokio;

#[tokio::main]
async fn main() {
    println!("APP STARTED");
    match check_and_download_mockstruct().await {
        Ok(_) => {
            println!("MockStruct is ready.");
            mockstructgui_lib::run();
        }
        Err(e) => {
            eprintln!("Error: {}", e);
        }
    }
}

async fn check_and_download_mockstruct() -> Result<(), Box<dyn std::error::Error>> {
    let os = env::consts::OS;
    let file_name = match os {
        "windows" => "mockstruct-win.exe",
        "macos" => "mockstruct-macos",
        "linux" => "mockstruct-linux",
        _ => return Err("Unsupported OS".into()),
    };
    
    let bin_dir = Path::new("./bin");
    let file_path = bin_dir.join(file_name);
    
    let loading_message = format!("Checking for {}...", file_name);
    println!("{}", loading_message);
    
    if !file_path.exists() {
        println!("Binary not found. Downloading...");
        download_mockstruct(file_name).await?;
    } else if is_outdated(&file_path).await? {
        println!("Binary is outdated. Downloading latest version...");
        download_mockstruct(file_name).await?;
    } else {
        println!("Binary is up to date.");
    }
    
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = fs::metadata(&file_path)?.permissions();
        perms.set_mode(0o755);
        fs::set_permissions(&file_path, perms)?;
    }
    
    Ok(())
}

async fn is_outdated(file_path: &Path) -> Result<bool, Box<dyn std::error::Error>> {
    // Check if the file exists
    if !file_path.exists() {
        return Ok(true);
    }
    
    let current_version: Version = match get_binary_version(file_path) {
        Ok(version) => version,
        Err(_) => {
            println!("Could not determine current version, assuming outdated.");
            return Ok(true);
        }
    };
    
    let latest_version = get_latest_version().await?;
    
    println!("Current version: {}", current_version);
    println!("Latest version: {}", latest_version);
    
    // Compare versions
    Ok(current_version < latest_version)
}

fn get_binary_version(file_path: &Path) -> Result<Version, Box<dyn std::error::Error>> {
    let output = Command::new(file_path)
        .arg("--version")
        .output()?;
    
    if output.status.success() {
        let version_output = String::from_utf8(output.stdout)?;
        let version_str = version_output
            .split_whitespace()
            .last()
            .ok_or("Invalid version output")?;
        
        let version = Version::parse(version_str.trim())?;
        Ok(version)
    } else {
        let version_file_path = file_path.parent().unwrap().join("version.txt");
        if version_file_path.exists() {
            let content = fs::read_to_string(version_file_path)?;
            let version = Version::parse(content.trim())?;
            Ok(version)
        } else {
            Err("Could not determine binary version".into())
        }
    }
}

async fn get_latest_version() -> Result<Version, Box<dyn std::error::Error>> {
    let url = "https://api.github.com/repos/FANNYMU/MockStruct/releases/latest";
    let client = reqwest::Client::new();
    
    let response = client
        .get(url)
        .header("User-Agent", "mockstructgui")
        .timeout(std::time::Duration::from_secs(10))
        .send()
        .await?;
    
    if !response.status().is_success() {
        return Err(format!("GitHub API request failed: {}", response.status()).into());
    }
    
    let json: serde_json::Value = response.json().await?;
    let tag_name = json["tag_name"].as_str().ok_or("Invalid response: missing tag_name")?;
    
    // Remove 'v' prefix if present
    let version_str = tag_name.strip_prefix('v').unwrap_or(tag_name);
    let latest_version = Version::parse(version_str)?;
    
    Ok(latest_version)
}

async fn download_mockstruct(file_name: &str) -> Result<(), Box<dyn std::error::Error>> {
    let download_url = format!(
        "https://github.com/FANNYMU/MockStruct/releases/latest/download/{}",
        file_name
    );
    
    println!("Downloading from: {}", download_url);
    
    let client = reqwest::Client::new();
    let response = client
        .get(Url::parse(&download_url)?)
        .timeout(std::time::Duration::from_secs(300))
        .send()
        .await?;
    
    if !response.status().is_success() {
        return Err(format!("Download failed: {}", response.status()).into());
    }
    
    let total_size = response.content_length().unwrap_or(0);
    println!("Downloading {} bytes...", total_size);
    
    let bytes = response.bytes().await?;
    
    let bin_dir = Path::new("./bin");
    let file_path = bin_dir.join(file_name);
    
    fs::create_dir_all(bin_dir)?;
    
    fs::write(&file_path, bytes)?;
    
    save_version_info(&file_path).await?;
    
    println!("Download completed: {}", file_path.display());
    
    Ok(())
}

async fn save_version_info(file_path: &Path) -> Result<(), Box<dyn std::error::Error>> {
    match get_latest_version().await {
        Ok(version) => {
            let version_file_path = file_path.parent().unwrap().join("version.txt");
            fs::write(version_file_path, version.to_string())?;
        }
        Err(e) => {
            eprintln!("Warning: Could not save version info: {}", e);
        }
    }
    
    Ok(())
}