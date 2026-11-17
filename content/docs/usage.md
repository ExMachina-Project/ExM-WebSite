ExMachina 提供终端、WebUI 与桌面交互。它们使用同一套模型、记忆与编队机制；选择适合当前工作的入口即可。

## 三个核心概念

**交互目标**是当前对话的对象，可以是单个智能体，也可以是一个智能体组。切换目标会切换对应的会话上下文。

**指挥体与子个体**属于组模式。指挥体收拢目标、拆解任务、派发和裁决；子个体在各自职责域内执行，并提交结构化回流。

**三账**记录任务、证据和风险。它们把目标与验收口径、结论依据、影响与回退路径连接在一起。

## 终端与单次任务

```bash
# 启动终端工作台
exm

# 单次下达任务
exm chat "分析当前项目的架构风险"

# 观察编成与会话任务图
exm agents
exm tasks <sessionId>

# 启动本地网关
exm gateway --port 4173
```

`exm` 与 `exmachina` 可互换。终端交互中可以先用 `/help` 查看当前版本支持的斜杠命令，用 `/status` 查看运行状态。

### 在脚本中使用

```bash
exm -p "总结当前工作区的模块职责"
echo "列出需要处理的任务" | exm -p
exm -p "继续" -c
exm -p "汇总项目结构" --output-format json
```

无头模式适合脚本与 CI 集成。需要机器读取结果时，选择当前版本支持的结构化输出格式。

## 选择单体或编队

| 交互形态 | 执行方式 | 适合的工作 |
| --- | --- | --- |
| 单个智能体 | 结合系统提示与会话历史，自主调用工具直至产出答复 | 问答、文件处理、编码与调试等由一个智能体推进的工作 |
| 智能体组 | 指挥体规划与派发，子个体契约回流 | 并行研究、跨模块改动、需要独立校验的任务 |

在 WebUI 的对话页选择交互目标。终端可用 `/target` 列出可选目标，再使用 `/target single <id>` 或 `/target group <id>` 切换。

单个智能体支持终端、文件修改、浏览器与 MCP 等工具，具体可用范围由工具权限、审批和沙箱策略决定；分层记忆、模型选择与自定义 SOUL 同样适用。选择智能体组后，才进入指挥体规划、派发与契约回流的协作流程。切换交互目标会切换会话上下文。

### 创建自己的组

```bash
exm group list
exm group create 研发组
exm group switch 研发组
exm group info 研发组
```

组是编成与隔离的单位。添加第一个个体时，它会成为该组的主智能体；后续成员作为子个体参与协作。具体创建参数可用当前 CLI 帮助查看。

## 配置模型与 SOUL

默认模型按个体、所属组、全局档案逐级解析。这样可以让不同职责使用不同模型，同时保持全局回退路径。

```bash
exm model list
exm model use <profile-id>
exm model test <profile-id>
```

SOUL 定义表达风格，而不替代工具、审批或编排机制。

```bash
exm persona get machina
exm persona set machina --text "简洁陈述结论，并明确证据与不确定性。"
exm persona reset machina
```

## 观察执行过程

WebUI 可查看会话消息、任务 DAG、三账、审批、记忆与事件。组模式下，建议沿以下顺序检查任务：

1. 确认当前目标与工作区是否正确。
2. 查看规划中的边界、依赖与验收条件。
3. 观察工具调用、子个体执行和 SyncReport 回流。
4. 如有冲突或阻塞，查看裁决依据和解除条件。
5. 在三账中检查最终证据、风险与回退路径。

## 记忆与文件检查点

```bash
exm memory search "构建入口"
exm memory stats
exm checkpoint list
```

个体记忆与群体记忆各有作用域，派发时会组合可见内容。写入和编辑文件前的检查点可帮助检查与恢复改动，恢复前先确认文件路径和所选版本。

## 插件与扩展

```bash
exm plugin list
exm plugin install ./my-plugin.tgz
exm plugin update <plugin-id>
```

官网[插件市场](/plugins)未来开放。项目现有的 CLI 和 WebUI 插件管理不依赖该网页市场，开发方式见[插件开发指南](/docs/plugins)。
