# Claude Code Subagents

This repository ships a set of [Claude Code](https://docs.claude.com/en/docs/claude-code)
subagents in `.claude/agents/`. When you run Claude Code inside the repo, these specialists
are available alongside your own. Claude picks one automatically when a task matches its
description, or you can ask for one by name:

```
> Use the accessibility-tester agent to audit service-details/pswdo.html
> Have the seo-specialist review the meta tags on the homepage
```

The agent files are copied unmodified from
[VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
(MIT License; see `.claude/agents/THIRD_PARTY_NOTICE.txt` for the commit and license text).

## What's included and when to use it

| Area                          | Agents                                                                                                   | Typical use here                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Front end                     | `frontend-developer`, `ui-designer`, `javascript-pro`                                                    | Page layout, CSS, the vanilla JS in `assets/js/`                  |
| React app                     | `react-specialist`, `nextjs-developer`, `typescript-pro`                                                 | `react-app/` (the `/services/health` page)                        |
| Scripts                       | `python-pro`                                                                                             | Maintenance scripts in `scripts/`                                 |
| Quality                       | `code-reviewer`, `debugger`, `qa-expert`, `test-automator`, `ui-ux-tester`                               | Reviews, bug hunts, Playwright tests in `tests/`                  |
| Accessibility and performance | `accessibility-tester`, `performance-engineer`                                                           | WCAG 2.1 AA checks, Lighthouse scores, page weight                |
| Security                      | `security-auditor`                                                                                       | Read-only audits (CSP, third-party scripts, data exposure)        |
| Build and deploy              | `build-engineer`, `deployment-engineer`, `devops-engineer`, `dependency-manager`, `git-workflow-manager` | `build.sh`, `wrangler.jsonc`, GitHub Actions, npm updates         |
| Docs                          | `documentation-engineer`, `technical-writer`, `readme-generator`, `docs-drift-editor`                    | Keeping `docs/` and `README.md` accurate                          |
| Content                       | `content-quality-editor`, `ux-microcopy-reviewer`, `seo-specialist`, `ux-researcher`                     | Plain-language page text, button labels, meta tags, user research |
| Research                      | `research-analyst`, `data-researcher`, `search-specialist`                                               | Finding and verifying public data about Bukidnon                  |

## Using research agents responsibly

The research agents can browse the web. Anything they find is a lead, not a fact. Before a
number or name goes on the site:

1. Find it on an official source (PSA, COMELEC, DILG, DBM, BLGF, bukidnon.gov.ph) or a
   reputable secondary source.
2. Add it to [bukidnon-facts.md](bukidnon-facts.md) with the source and a status.
3. Then update the page.

## Adding or updating agents

To add another agent from the VoltAgent collection, copy its `.md` file from
`categories/<category>/` in that repository into `.claude/agents/`, read it first, and update
the commit in `THIRD_PARTY_NOTICE.txt`. Project agents override user-level agents with the
same name in `~/.claude/agents/`.

Agent files set a `model:` in their front matter (`sonnet`, `haiku` or `inherit`). Change it
in the file if you want a different trade-off between cost and capability.
