---
title: Automating a Full-Stack, Multi-Environment Deployment Pipeline
description: Let's figure out how to automate the deployment of a full stack project using tailored configurations for different environments, without increasing developer workload or technical debt
image: /images/blog/quinten-de-graaf-pipelines.jpg
tags: Devops, CICD, Automation
created: 1738864468
lastUpdated:
---

I have a confession to make, I am terrible at remembering all the different deployment checks and publishing chores for each of my projects. It's embarrassing, I know. Now that the air has been cleared, let's find a way to compensate for my shortcomings.

In my latest project, I'll set up a full-stack multi-environment deployment pipeline using [GitHub Actions](https://github.com/features/actions). This has been so incredibly useful, I decided to share some details about why I chose this configuration and the benefits of this approach:

## But Why?

<img alt="But Why?" width="320" src="/images/blog/but-why.jpg#right" >
For my project, I needed a safe space to test code changes before they went live. Local development has its place, but you know it can be a pain for applications hosted on multiple environments. A staging platform provides a valuable resource for stakeholder reviews, facilitating regular feedback and deeper collaboration. This setup allows me to push changes where they are needed, and automagically perform any steps required for each environment. I shake my head when I think about all the time I wasted doing this manually.

## Laying the Pipeline

I organized my repository into separate branches to accommodate each environment: main for production and develop for staging. Don't forget, this is a full-stack app, with front and backend hosted on different environments. This pipeline uses two Sync-to-FTP actions with separate credentials to deploy both front and backend to their respective servers. If you've ever mistakenly pushed the wrong files to the wrong server, you understand how helpful this is.

To control each environment independently, we can use environment-specific configurations. My staging environment uses a separate database, different API keys, and its own settings. GitHub Actions repository secrets simplify automating anything that varies between environments, like [feature flags and API endpoints](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions).

Conditional job execution allowed workflows to run differently depending on the branch. Staging can run a full suite of tests, providing confidence in the stability of the codebase. Production only gets a quick smoke test. To make it easier to inspect and debug code in the browser console, I disabled minification and enabled sourcemaps for the front-end on the staging environment. On production, minification was enabled to optimize performance and debug logging disabled to prevent accidental leaking of sensitive user data (I've written more about [stripping debug logs at build time here](https://magill.dev/post/strip-debug-logs-at-build-time-with-nextjs)).

## Access Control

One key benefit of this approach is access control. By granting developers access to specific branches, they automatically gain the ability to trigger deployments to the corresponding environments. Instead of juggling individual logins or shared credentials for each environment's hosting platform, I could manage access at the repository branch level. This not only streamlined onboarding and offboarding but also significantly improved security.

## Workflow Procedure

Workflows are triggered by pushes to the relevant branches. In my workflow, a push to develop triggers the staging deployment, and a push to main triggers the production deployment.

The front-end build process uses `npm run build` which runs the front-end build process (which is defined in package.json, silly). On staging, we can specify separate configuration files, with the `--config dev.config.js` flag to customize the build process more precisely. This back-end build uses a generic `composer install` action, which [could be customized further](https://github.com/ramsey/composer-install).

Here's a more detailed snippet, tying it all together:

```YAML
name: Deploy Main to LIVE FTP
on:
  push:
    branches:
      - main
jobs:
  FTP-Deploy-Action:
    name: Deploy to LIVE Action
    runs-on: ubuntu-latest
    steps:
    - name: Get latest code
      uses: actions/checkout@v4

    - name: Use Node.js 18
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: Build Front
      run: |
        npm install
        npm run build
      working-directory: ./front/

    - name: Sync Front Files
      uses: SamKirkland/FTP-Deploy-Action@v4.3.5
      with:
        server: ##.###.##.###
        username: frontuser
        password: ${{ secrets.front_ftp_password }}
        protocol: ftps
        local-dir: ./front/
        server-dir: /front/

    - name: Setup PHP
      uses: "shivammathur/setup-php@v2"
      with:
        php-version: "latest"

    - name: Build Backend
      uses: "ramsey/composer-install@v3"
      with:
        working-directory: ./back/

    - name: Sync Back Files
      uses: SamKirkland/FTP-Deploy-Action@v4.3.5
      with:
        server: ##.###.##.###
        username: backuser
        password: ${{ secrets.back_ftp_password }}
        protocol: ftps
        local-dir: ./back/
        server-dir: /back/
```

## To be continued...

This multi-environment deployment pipeline has been working great. The simplified access control and the ability to customize build processes for each environment have made deployments easier and faster, freeing me up for other stuff. Because everything is baked into the pipeline, I don't need to remember all the minutiae and procedures required to safely publish projects that use this approach. There are endless ways this approach could be adapted to other projects, and I'm eager to explore what else these methods can accomplish.

### Related Links

- [Official Documentation:](https://docs.github.com/en/actions) From Github
- [Using secrets in GitHub Codespaces:](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/managing-development-environment-secrets-for-your-repository-or-organization) From Github
