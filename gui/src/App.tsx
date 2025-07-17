import React, { useState } from "react";
import {
  Code,
  Sparkles,
  Zap,
  FileText,
  Settings,
  Play,
  Copy,
  Download,
} from "lucide-react";

function App() {
  const [filePath, setFilePath] = useState("");
  const [interfaceName, setInterfaceName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockResult, setMockResult] = useState("");

  function generateMock() {
    setIsGenerating(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mock Generator Pro
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-400 ml-2 animate-pulse" />
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Generate powerful TypeScript mocks with AI-powered intelligence.
            Transform your interfaces into realistic mock data instantly.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Configuration
                  </h2>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* File Path Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    File Path
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filePath}
                      onChange={(e) => setFilePath(e.target.value)}
                      placeholder="./src/types/User.ts"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Interface Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Interface Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={interfaceName}
                      onChange={(e) => setInterfaceName(e.target.value)}
                      placeholder="User"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <button
                  onClick={generateMock}
                  disabled={isGenerating || !filePath || !interfaceName}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="flex items-center">
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                        Generate Mock
                      </>
                    )}
                  </div>
                  {!isGenerating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          {mockResult && (
            <div className="mt-8 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl">
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mr-3">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Generated Mock
                    </h2>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-200">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-200">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-700/30">
                  <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                    <code>{mockResult}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Lightning Fast",
              description:
                "Generate mocks in seconds with optimized algorithms",
            },
            {
              icon: <Code className="w-6 h-6" />,
              title: "Type Safe",
              description:
                "Full TypeScript support with accurate type inference",
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "AI Powered",
              description: "Smart mock generation with realistic data patterns",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/30 p-6 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg w-fit mb-4 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-purple-500 rounded-full animate-ping opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-6 h-6 bg-pink-500 rounded-full animate-pulse opacity-30"></div>
      <div className="absolute top-1/2 left-10 w-2 h-2 bg-blue-500 rounded-full animate-bounce opacity-40"></div>
    </div>
  );
}

export default App;
