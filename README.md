# DeFlock SD Frontend

A Jekyll-based website for the DeFlock San Diego chapter, documenting ALPR (Automatic License Plate Recognition) infrastructure and its impact on privacy and civil liberties.

## About

DeFlock SD is a local chapter focused on tracking the spread of ALPR surveillance systems. This website serves as a platform to:

- Map ALPR infrastructure in San Diego
- Document the impact of ALPR systems on privacy
- Provide resources for understanding ALPR technology
- Promote resistance against mass surveillance

## Technology

This site is built using:
- **Jekyll**: Static site generator
- **jekyll-theme-console**: Minimalist console-style theme
- **GitHub Pages**: Hosting platform

## Local Development

### Prerequisites

- Ruby (version 2.7.0 or higher)
- Bundler

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/the-flockers/frontend.git
   cd frontend
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

3. Run the development server:
   ```bash
   bundle exec jekyll serve
   ```

4. Open your browser and visit `http://localhost:4000`

### Configuration

Site settings can be modified in `_config.yml`:
- `title`: Site title
- `description`: Site description
- `url`: Base URL for the site
- `github_username`: GitHub organization/user

## Project Structure

```
frontend/
├── _config.yml          # Site configuration
├── _posts/              # Blog posts
├── _sass/               # Custom styles
├── assets/              # Static assets (images, etc.)
├── nav/                 # Navigation pages
│   ├── about.md
│   └── learn.md
├── index.md             # Home page
├── 404.html             # 404 error page
├── Gemfile              # Ruby dependencies
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

This site is configured for deployment on GitHub Pages. Changes pushed to the main branch will automatically trigger a deployment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- GitHub: [@the-flockers](https://github.com/the-flockers)
- Website: [deflock.org](https://deflock.org)

## Related Projects

- [DeFlock Main Website](https://deflock.org)
- [Flock You - ALPR Detection](https://github.com/colonelpanichacks/flock-you)