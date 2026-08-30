# Jenkins Static Website CI/CD

This project automatically deploys a static HTML/CSS website from GitHub to an AWS EC2 Nginx web server using Jenkins.

## Architecture

Developer → GitHub → Jenkins EC2 → Nginx EC2

## Tools

- AWS EC2
- Jenkins
- GitHub
- Git
- Nginx
- Linux
- SSH
- Rsync
- HTML and CSS

## Pipeline stages

1. Checkout source code
2. Validate website files
3. Deploy using SSH and rsync
4. Run an HTTP health check
