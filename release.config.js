const branch = process.env.CURRENT_BRANCH || "main";

if (!branch) {
    throw new Error("CURRENT_BRANCH not set");
}

/**
 * @type {import("semantic-release").GlobalConfig}
 */
const config = {
    branches: ["main"],
    repositoryUrl: "https://github.com/JamsRepos/Jamfin.git",
    plugins: [
        [
            "@semantic-release/exec",
            {
                prepareCmd: `
                    echo "Branch: ${branch}" &&
                    echo "\${nextRelease.version}" > VERSION.txt &&
                    echo "Updating CDN links to version \${nextRelease.version}" &&
                    node replace.version.js \${nextRelease.version} . &&
                    git add VERSION.txt README.md theme/complete.css
                `
            },
        ],
        [
            "@semantic-release/commit-analyzer",
            {
                releaseRules: [
                    { scope: "no-release", release: false },
                    { type: "build", release: "patch" },
                    { type: "ci", release: "patch" },
                    { type: "chore", release: "patch" },
                    { type: "docs", release: "patch" },
                    { type: "refactor", release: "patch" },
                    { type: "style", release: "minor" },
                    { breaking: true, release: "major" },
                ],
            },
        ],
        [
            "@semantic-release/release-notes-generator",
            {
                preset: "conventionalcommits",
                presetConfig: {
                    types: [
                        { type: "feat", section: "New Features" },
                        { type: "fix", section: "Bug Fixes" },
                        { type: "perf", section: "Performance Improvements", hidden: false },
                        { type: "revert", section: "Commit Reverts", hidden: false },
                        { type: "build", section: "Build System", hidden: false },
                        { type: "ci", section: "Continuous Integration", hidden: false },
                        { type: "chore", section: "Chores", hidden: false },
                        { type: "docs", section: "Documentation", hidden: false },
                        { type: "style", section: "Style Changes", hidden: false },
                        { type: "refactor", section: "Code Refactoring", hidden: false },
                        { type: "test", section: "Test Cases", hidden: true },
                    ],
                },
            },
        ],
        [
            "@semantic-release/changelog",
            {
                changelogFile: "CHANGELOG.md",
            },
        ],
        [
            "@semantic-release/git",
            {
                assets: ["CHANGELOG.md", "VERSION.txt", "README.md", "theme/complete.css"],
                message: "chore: 🧹 \${nextRelease.version}\n\n\${nextRelease.notes}",
            },
        ],
    ],
};

if (branch === "main") {
    config.plugins.splice(-2, 0, "@semantic-release/github");
}

module.exports = config;
