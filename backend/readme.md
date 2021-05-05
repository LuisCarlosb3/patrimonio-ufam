### Project Architeture

Based on Clean-Architeture, this project was divided on follow layers:

 - **Data:**
 Layer where use cases are implemente
 - **Domain:**
 Layer where domain models and use cases are defined
 - **Infra:**
 Layer where database, sockets and mqtt connections are treated
 - **Main:**
 Layer where frameworks are used, on application is builded
 - **Presentation**
 Layer where data came from frameworks are treated

This architeture was define by [Clean Architeture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
***
### Project Dev Dependences:

 - [**eslit**](https://eslint.org/)
 this package was selected to enforce code style based on Stardard definitions
 - [**typescript**](https://www.typescriptlang.org/)
 typerscript was selected for help during project, types can help on best comunication
 - [**jest**](https://jestjs.io/)
 for build tests, jest was selected because this library have a simple sintax and great documentation
 - [**husky**](https://www.npmjs.com/package/husky)
 husky is like a hook that will run before each git-commit and git-push to enforce code quality and prevent crashed features on repository
 - [**lint-staged**](https://github.com/okonet/lint-staged)
 lint-staged help with code style, before each commit, lint will fix code style problems
 - [**git-commit-msg-linter**](https://www.npmjs.com/package/git-commit-msg-linter)
 to organize repository please use "small commits methodology", commits out of pattern will be reject, (please see [conventional commits](https://www.conventionalcommits.org/pt-br/v1.0.0-beta.4/))

***
