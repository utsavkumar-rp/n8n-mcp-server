#!/bin/bash

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/utsavkumar-rp/n8n-mcp-server.git"
CLONE_DIR="n8n-mcp-server"
MCP_CONFIG_FILE=""

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
        if [ "$MAJOR_VERSION" -ge 18 ]; then
            print_status "Node.js v$NODE_VERSION is already installed and compatible"
            return 0
        else
            print_warning "Node.js v$NODE_VERSION is installed but version 18+ is recommended"
            return 1
        fi
    else
        return 1
    fi
}

# Function to install Node.js
install_node() {
    print_status "Installing Node.js..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            print_status "Installing Node.js using Homebrew..."
            brew install node
        else
            print_error "Homebrew not found. Please install Homebrew first or install Node.js manually"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command_exists apt-get; then
            print_status "Installing Node.js using apt-get..."
            sudo apt-get update
            sudo apt-get install -y nodejs npm
        elif command_exists yum; then
            print_status "Installing Node.js using yum..."
            sudo yum install -y nodejs npm
        elif command_exists dnf; then
            print_status "Installing Node.js using dnf..."
            sudo dnf install -y nodejs npm
        else
            print_error "No suitable package manager found. Please install Node.js manually"
            exit 1
        fi
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# Function to clone repository from git
clone_repository() {
    print_status "Cloning repository from GitHub..."
    
    # Check if git is available
    if ! command_exists git; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    # Clean up existing directory if it exists
    if [ -d "$CLONE_DIR" ]; then
        print_warning "Directory $CLONE_DIR already exists. Removing it..."
        rm -rf "$CLONE_DIR"
    fi
    
    # Clone the repository
    print_status "Cloning from $REPO_URL..."
    if git clone "$REPO_URL" "$CLONE_DIR"; then
        print_status "Repository cloned successfully to $CLONE_DIR"
    else
        print_error "Failed to clone repository from $REPO_URL"
        exit 1
    fi
    
    # Enter the directory
    cd "$CLONE_DIR"
    print_status "Changed to directory: $(pwd)"
}


# Function to install dependencies and build
build_project() {
    print_status "Installing dependencies..."
    npm install
    
    print_status "Building project..."
    npm run build
    
    print_status "Project built successfully"
}

# Function to generate MCP configuration
generate_mcp_config() {
    local current_path=$(pwd)
    local build_path="$current_path/build/index.js"
    MCP_CONFIG_FILE="$current_path/mcp.json"
    
    print_status "Generating MCP configuration at $MCP_CONFIG_FILE..."
    
    # Create .cursor directory if it doesn't exist
    mkdir -p "$HOME/.cursor"
    
    # Generate the JSON configuration
    cat > "$MCP_CONFIG_FILE" << EOF
{
    "mcpServers": {
      "n8n-local": {
        "command": "node",
        "args": [
          "$build_path"
        ],
        "env": {
          "N8N_API_URL":"https://n8n-conc.razorpay.com/api/v1",
          "N8N_API_KEY":"<API_KEY>"
        },
        "disabled": false,
        "autoApprove": []
      }
    }
}
EOF

    print_status "MCP configuration generated successfully"
    print_status "Build path: $build_path"
}

# Main execution
main() {
    print_status "Starting n8n MCP Server setup..."
    
    # Check if script is run with sudo when needed
    if ! check_node_version; then
        print_warning "Node.js not found or version is too old"
        print_status "Checking if sudo access is available for Node.js installation..."
        
        # Check if we need sudo access
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if [ "$EUID" -ne 0 ]; then
                print_error "This script needs sudo access to install Node.js on Linux"
                print_error "Please run: sudo $0"
                exit 1
            fi
        fi
        
        install_node
    fi
    
    # Verify Node.js installation
    if ! check_node_version; then
        print_error "Node.js installation failed or version is still incompatible"
        exit 1
    fi
    
    # Download repository and build
    clone_repository
    build_project
    
    # Generate MCP configuration
    generate_mcp_config
    
    print_status "Setup completed successfully!"
    print_status "You can now use the n8n MCP server with the generated configuration"
    print_status "Configuration file: $MCP_CONFIG_FILE"
}

# Run main function
main "$@"
