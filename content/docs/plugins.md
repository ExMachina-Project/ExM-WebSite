插件是 ExMachina 的统一能力包：一份 `plugin.json` 清单与可选实现，用来声明工具、通道、轮询和资源。

官网[插件市场](/plugins)未来开放。当前可以使用项目已有的 CLI、WebUI 插件管理，以及本地插件目录进行开发和安装。

## 选择插件形态

| 形态 | 实现方式 | 适用场景 |
| --- | --- | --- |
| T1 声明式 | 清单内联 HTTP 工具 | 把已有 REST API 包装成模型可调用工具 |
| T2 进程式 | 任意语言的 stdio JSON-RPC 子进程 | 本地状态、复杂逻辑与长任务 |
| T3 内置式 | Rust trait，随宿主版本发布 | 深度集成运行时能力 |

零散的 CustomTool 与技能配置也可以扩展系统，但不等于独立插件目录。

## 最小清单

在项目的 `plugins/my-plugin/plugin.json` 中声明一个 HTTP 查询工具：

```json
{
  "id": "my-plugin",
  "name": "示例查询插件",
  "version": "0.1.0",
  "description": "通过 HTTP 接口查询信息",
  "tools": [
    {
      "name": "lookup",
      "description": "根据关键词查询",
      "kind": "http",
      "method": "GET",
      "target": "https://api.example.com/search?q={q}",
      "parameters": {
        "type": "object",
        "properties": {
          "q": { "type": "string" }
        },
        "required": ["q"]
      },
      "responseMaxChars": 4000
    }
  ]
}
```

这是清单结构示例，`api.example.com` 是占位端点，需替换为实际服务后才能调用。

插件 `id` 应与目录名一致。模型侧工具名使用 `<插件id>__<工具名>`，例如 `my-plugin__lookup`。

## 四类能力

- `tools`：声明工具组，或通过进程协议发现工具。
- `channel`：声明通道类型与凭据配置面。
- `watch`：配置轮询周期。
- `resources`：加载相对插件目录中的技能等资源。

插件至少声明一类能力。可用 `exmMin` 表达最低宿主版本，装载失败原因会显示在管理界面中。

## 安装与更新

```bash
# 查看已安装插件
exm plugin list

# 从本地归档安装
exm plugin install ./my-plugin.tgz

# 从 Git 仓库安装（替换为实际仓库）
exm plugin install https://example.com/owner/plugin.git

# 更新指定插件
exm plugin update my-plugin
```

项目还支持通过配置的索引 ID 解析插件，`plugins.indexUrl` 可自定义。官网网页市场与运行时索引是不同入口，当前网页不提供在线安装或发布服务。

## 进程插件生命周期

```text
initialize
    ↓
tools/list
    ↓
tools/call / config/set / watcher.tick
    ↓
shutdown
```

T2 插件从 stdin 按行读取 JSON-RPC 请求，向 stdout 写入响应；诊断输出使用 stderr。握手、调用超时和并发上限由清单约束。

## 凭据与响应治理

声明式工具可在目标与请求头中使用凭据变量，例如 `${credentials.token}`。缺少凭据时拒绝调用，而不是发送不完整请求。

`responseSelect` 用于摘取返回数据，`responseMaxChars` 限制进入模型上下文的长度。进程插件收到的敏感配置只应保存在进程内存。

## 本地验证

1. 检查清单 `id`、目录名和能力声明。
2. 在 WebUI 插件管理页或 `exm doctor` 中确认装载状态。
3. 配置实际端点与必要凭据。
4. 确认工具名出现在授权智能体的工具面中。
5. 验证调用、失败返回、禁用与进程回收。

完整清单、握手协商与 Rust trait 说明见[仓库插件开发指南](https://github.com/ExMachina-Project/ExMachina/blob/dev/docs/插件开发指南.md)。
