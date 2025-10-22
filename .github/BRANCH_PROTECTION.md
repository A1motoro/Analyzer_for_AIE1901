# 分支保护规则配置指南

## GitHub分支保护设置

### 主分支 (main) 保护规则

1. **进入设置**
   - 访问仓库：`https://github.com/A1motoro/Analyzer_for_AIE1901/settings`
   - 点击左侧菜单的 "Branches"

2. **添加分支保护规则**
   - 点击 "Add branch protection rule"
   - Branch name pattern: `main`

3. **配置规则**
   - ✅ **Require pull request reviews before merging**
     - Required approving reviews: 1
     - Dismiss stale pull request approvals when new commits are pushed: ✅
     - Require review from Code Owners: ❌ (可选)

   - ✅ **Require status checks to pass before merging**
     - 选择 `test` 和 `deploy` 检查项

   - ✅ **Require branches to be up to date before merging**
     - 保持分支更新

   - ✅ **Include administrators**
     - 规则也适用于仓库管理员

   - ✅ **Restrict pushes that create matching branches**
     - 限制直接推送

   - ✅ **Allow force pushes**
     - ❌ (禁止强制推送)

   - ✅ **Allow deletions**
     - ❌ (禁止删除分支)

### 开发分支 (develop) 保护规则

为develop分支设置相似但较宽松的规则：

1. Branch name pattern: `develop`
2. **Require pull request reviews before merging**: ✅
   - Required approving reviews: 1
3. **Require status checks**: ✅
4. **Include administrators**: ✅

## 权限管理

### 团队成员权限

为协作者设置适当权限：

1. **仓库设置 > Collaborators and teams**
2. 添加团队成员为协作者
3. 设置权限级别：
   - **Write**: 可以读写，但不能管理仓库
   - **Maintain**: 可以管理issues/PR，但不能删除仓库
   - **Admin**: 完全控制（谨慎分配）

### 保护规则的好处

- **代码质量保证**: 强制代码审查和测试
- **避免意外推送**: 防止直接推送到主分支
- **审计跟踪**: 记录所有更改历史
- **协作安全**: 多人协作时的代码安全

## 工作流示例

### 功能开发流程
```
feature-branch → Pull Request → develop → Pull Request → main
```

### 紧急修复流程
```
hotfix-branch → Pull Request → main (同时合并到develop)
```

## 注意事项

1. **分支保护不适用于仓库所有者/管理员**（除非明确设置）
2. **PR必须通过所有检查**才能合并
3. **至少需要一个批准**才能合并
4. **强制推送被禁止**，使用revert提交来撤销更改

## 常见问题

### Q: 如何处理紧急情况？
A: 如果需要紧急部署，可以临时关闭分支保护，或使用管理员权限强制合并。

### Q: 如何修改保护规则？
A: 只有仓库管理员可以修改分支保护规则。

### Q: 保护规则会影响GitHub Actions吗？
A: 不会，GitHub Actions仍然可以推送，但用户推送会被阻止。

---

配置完成后，团队协作将更加安全和规范！🔒
