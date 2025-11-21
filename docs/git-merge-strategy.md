# Git Merge Strategy for Site Exports

## Problem

When exporting a site multiple times, git conflicts occur because:
1. Remote repository may have manual edits to template files (layouts, components, styles)
2. CMS generates fresh content (pages, posts) from database on each export
3. Current approach (simple pull + push) creates merge conflicts

## Solution: Path-based Merge Strategies

Use git attributes to define different merge strategies for different file types:
- **CMS-managed content** → Always use CMS version (database is source of truth)
- **Template files** → Always use remote version (allow customization in GitHub)

## Implementation

### 1. Add `.gitattributes` to Template Repository

Location: `https://github.com/ap1969/primacms-builder-template/.gitattributes`

```gitattributes
# CMS-managed content (CMS version always wins)
src/pages/*.astro merge=ours
src/content/posts/*.md merge=ours

# Template/infrastructure files (remote version wins - allows customization)
src/components/* merge=theirs
src/layouts/* merge=theirs
src/styles/* merge=theirs
astro.config.mjs merge=theirs
package.json merge=theirs
package-lock.json merge=theirs
pnpm-lock.yaml merge=theirs
tsconfig.json merge=theirs
.gitignore merge=theirs
README.md merge=theirs

# Assets (remote wins - users may add custom images/fonts)
public/* merge=theirs
src/assets/* merge=theirs
```

### 2. Configure Git Merge Drivers in ExportSiteToAstro

Add git config commands after initializing the repository in `initializeDestinationRepo()` method:

```php
private function initializeDestinationRepo(string $repoPath, string $destRepoUrl, string $branch): void
{
    $gitPath = "{$repoPath}/.git";

    // Initialize git if not already initialized
    if (!File::exists($gitPath)) {
        Log::info('Initializing git repository', ['path' => $repoPath]);
        Process::path($repoPath)->run(['git', 'init']);
        Process::path($repoPath)->run(['git', 'checkout', '-b', $branch]);

        // Configure merge drivers
        Process::path($repoPath)->run(['git', 'config', 'merge.ours.driver', 'true']);
        Process::path($repoPath)->run(['git', 'config', 'merge.theirs.driver', 'git merge-file --theirs %O %A %B']);
    }

    // ... rest of method
}
```

### 3. Update Pull Command

Change the pull in `commitAndPush()` to NOT use `-X ours` globally since we're using per-file strategies:

```php
// Pull any remote changes first
Log::info('Pulling from remote before push', ['site_id' => $site->id, 'branch' => $branch]);
$pullResult = Process::path($repoPath)
    ->timeout(60)
    ->env([
        'GIT_TERMINAL_PROMPT' => '0',
        'GIT_ASKPASS'         => 'echo',
    ])
    ->run(['git', 'pull', 'origin', $branch, '--rebase']);

if (!$pullResult->successful()) {
    Log::warning('Pull failed, continuing with push', ['error' => $pullResult->errorOutput()]);
}
```

## How It Works

### Merge Driver Explanations

1. **`merge=ours` driver**:
   - Configured as `true` (no-op)
   - Always keeps the local (CMS) version
   - Used for: pages, posts

2. **`merge=theirs` driver**:
   - Uses `git merge-file --theirs`
   - Always keeps the remote (GitHub) version
   - Used for: templates, config, assets

### Example Scenario

**Before Export:**
- Remote repo has customized `Header.astro` component
- Remote repo has old version of `test-post-1.md`
- User edits posts in CMS database

**During Export:**
1. CMS downloads template ZIP (gets default files)
2. CMS generates pages/posts from database
3. Git pull detects conflicts:
   - `src/components/Header.astro` → Uses remote (theirs) - keeps customization
   - `src/content/posts/test-post-1.md` → Uses CMS (ours) - database wins
4. Push succeeds with no manual conflict resolution needed

## Benefits

1. **No user prompts needed** - Automatic, intelligent resolution
2. **Supports template customization** - Users can edit components/styles in GitHub
3. **CMS remains authoritative** - Content always comes from database
4. **No merge conflict markers** - Clean files every time
5. **Works with existing workflow** - No breaking changes

## Files to Modify

### Backend
- `app/Actions/ExportSiteToAstro.php`
  - Add merge driver config in `initializeDestinationRepo()`
  - Remove `-X ours` from pull command in `commitAndPush()`

### Template Repository
- Add `.gitattributes` file to root
- Commit and push to GitHub

## Testing

1. Export a site initially
2. Manually edit a component file in GitHub (e.g., change Header.astro)
3. Edit a post in the CMS
4. Export again
5. Verify:
   - Manual component edits are preserved (remote version kept)
   - Post content matches CMS database (CMS version kept)
   - No merge conflict errors

## Alternative Considered

**User prompt approach**: Ask user before export if conflicts detected.
- ❌ More complex UI
- ❌ Extra click/decision for user
- ❌ All-or-nothing choice (can't mix strategies)
- ✅ Explicit control

**Path-based automatic resolution**: (This approach)
- ✅ Zero user interaction
- ✅ Smart per-file decisions
- ✅ Supports best practices (CMS for content, GitHub for customization)
- ❌ Requires understanding git attributes

## Future Enhancements

1. **Template marketplace**: Different templates may need different attribute rules
2. **Custom merge strategies**: Allow users to configure their own rules
3. **Conflict reporting**: Log when conflicts were auto-resolved for transparency
4. **Dry-run mode**: Show what would be resolved before committing

## References

- [Git Attributes Documentation](https://git-scm.com/docs/gitattributes)
- [Git Merge Drivers](https://git-scm.com/docs/gitattributes#_defining_a_custom_merge_driver)
- [Merge Strategy Options](https://git-scm.com/docs/merge-strategies)
