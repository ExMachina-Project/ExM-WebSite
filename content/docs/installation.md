从安装到第一次对话：准备运行环境、启动本地网关，再连接你选择的模型。`exm` 与 `exmachina` 是同一实现的两个命令名。

## 选择安装方式

| 方式 | 需要准备 | 适合场景 |
| --- | --- | --- |
| 预编译发行版 | 支持的操作系统与网络连接 | 希望直接使用，无需 Rust / Node.js |
| 源码构建 | Rust stable、Node.js ≥ 22、Git | 开发、调试或修改项目 |
| Docker | Docker 与 Compose | 在容器中运行网关 |

Linux、macOS 与 Windows 均有安装入口。首次运行需要配置模型服务；使用本地模型时，需要先启动对应的模型端点。

## 使用安装引导脚本

Linux / macOS：

```bash
curl -fsSL https://raw.githubusercontent.com/ExMachina-Project/ExMachina/main/scripts/install.sh | bash
```

Windows：在命令提示符中下载后运行。

```batch
curl -fsSL -o install.bat https://raw.githubusercontent.com/ExMachina-Project/ExMachina/main/scripts/install.bat
install.bat
```

引导脚本可以交互式选择预编译发行版或源码构建。Linux / macOS 可传入 `--bin` 或 `--src`，直接选择安装形态。

## 从源码构建

```bash
git clone https://github.com/ExMachina-Project/ExMachina.git
cd ExMachina

# 构建 WebUI
npm install
npm run build:webui

# 运行安装向导：检查环境、接入模型与写入配置
cargo run -p exm-cli --release --bin exmachina -- install

# 启动网关
cargo run -p exm-gateway --release
```

网关同时提供 REST、WebSocket 与 WebUI。浏览器打开 `http://127.0.0.1:4173`。源码构建 WebUI 时需要 Node.js；已构建的网关运行不需要现场编译 WebUI。

### Docker 部署

在已有仓库的开发环境中：

```bash
GIT_HASH=$(git rev-parse --short HEAD) docker compose build
docker compose up -d
```

根目录开发栈使用 `http://localhost:4174`。仓库 `deploy/` 中的部署模板使用另一套 Compose 配置，默认入口为 `http://localhost:4173`。

> 两套 Compose 栈的端口、状态卷与用途不同。部署前按仓库中的模板确认配置，不要把开发栈端口当成所有安装方式的默认端口。

## 连接模型服务

打开 WebUI 的模型设置页面，添加提供商档案、端点、模型名与 API Key。测试连通后设为全局默认。支持以下协议：

| 协议 | 典型接入 |
| --- | --- |
| OpenAI 兼容 | OpenAI、DeepSeek、Ollama、vLLM 等兼容端点 |
| Anthropic 原生 | Claude 系列 |
| Gemini 原生 | Google Gemini |
| Azure OpenAI | Azure OpenAI 部署 |

CLI 同样可以管理档案。将下面的占位值替换为自己的配置：

```bash
exm model add my-model --name "我的模型" \
  --base-url https://api.example.com/v1 \
  --api-key YOUR_API_KEY --model YOUR_MODEL
exm model use my-model
exm model test my-model
```

配置位于工作区的 `.exmachina/config.json`。涉及真实凭据的配置文件无需公开；如需从其他设备访问，请配置访问密钥，详见[安全与权限](/docs/security)。

## 验证第一次运行

```bash
exm doctor
exm agents
exm chat "你好，自我介绍"
```

`doctor` 检查配置、编成、记忆、通道与 WebUI。随后可以在终端或 WebUI 中选择单个智能体，或选择智能体组来执行任务。

## 常见问题

### WebUI 无法打开

确认网关正在运行、端口没有被其他进程占用。源码安装时还要确认 `npm run build:webui` 已成功生成前端产物。CLI 网关可用 `exm gateway --port 5000` 指定其他端口。

### 尚未配置模型

ExMachina 使用你接入的模型执行任务。没有可用模型时，先完成提供商配置与连通测试，再开始对话。

### 下一步

阅读[使用指南](/docs/usage)，理解交互目标、组与会话；需要容器配置细节时，可查看[仓库部署模板](https://github.com/ExMachina-Project/ExMachina/tree/dev/deploy)。
