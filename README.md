# Finance Tracker

## Project Aim
The aim of this project was to create a fully serverless, secure and scalable REST API for tracking financial data. Furthermore, this projected also served to familarise myself with AWS and its functionalities and how it could be used with a CI/CD pipeline to ensure fast and reliable deployment.

## Technoloies Used
**Backend**: Node.js, AWS Lambda, AWS API Gateway for serverless architecture
**Database**: MongoDB for persistent storage
**Infrastructure**: Serverless Framework v4 for configuration and deployment
**CI/CD**: GitHub Actions for automated testing and continuous deployment
**Testing**: Jest for unit tests and maintaining code quality

## Key Features
**JWT Authentication**: Secure user login and token-based authorization for protected endpoints
**CRUD Endpoints**: Fully implemented create, read, update, and delete operations for expense records
**Serverless Architecture**: No servers to manage, automatic scaling, and cost-efficiency
**Automated Testing & Deployment**: Unit tests run in CI pipeline, ensuring code integrity before automatic deployment to AWS

<table>
    <td><img src="images/expenseAdd.png" alt="Addin an Expense" width="500"></td>
    <td><img src="images/expenseDelete.png" alt="Deleting an Expense" width="500"></td>
    <td><img src="images/expenseGet.png" alt="Getting an Expense" width="500"></td>
    <td><img src="images/userRegister.png" alt="Register User" width="500"></td>
    <td><img src="images/userLogIn.png" alt="Log-In User" width="500"></td>
</table>
