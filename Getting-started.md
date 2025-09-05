# Prepare the environment:

You have two options for setting up your development environment:

- **Old school style** (Install everything on your local machine)
- **Dev Container style** (Use Docker and Dev Containers)

---

## Option 1: Old School Style

To set up the environment manually, you'll need to install the following software on your PC:

- **.NET Core SDK 2.1**
- **Node.js** (version 22)
- **SQL Server**

Make sure all dependencies are installed and properly configured before proceeding.

---

## Option 2: Dev Container Style

For an easier setup using containers, you'll need the following:

- **Docker** (Make sure Docker is running)
- **Dev Containers extension for Visual Studio Code**  
  [Install the Dev Containers extension here](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

This method allows you to avoid manually setting up dependencies on your machine by using a preconfigured development container.

---

# Open the Repo

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/AccountTECH-Darwin/AT-Challenge.git
   ```

2. Open the repository in your IDE:
- Old school style: Open the folder locally in your code editor (VSCode, for example).
- Dev Container style: Open the folder in VSCode and let the Dev Container extension do its magic.

---

# Run the Apps

You need to run 2 separate apps:

1. The .NET Core API:
    
    Navigate to the net folder and run the following commands:
    
    ```bash
    cd app/net
    dotnet restore
    dotnet run
    ```

 

2. The React UI
    
    Navigate to the react folder and run:
    ```bash
    cd app/ui
    npm install
    npm run dev
    ```
Make sure all 2 apps are running in separate terminal windows/tabs to avoid blocking processes.

---

# Check Everything Is Working

Once all 2 apps are running, open your browser and go to:

- **Dot Net**: [http://127.0.0.1:5000](http://127.0.0.1:5000)
- **UI**: [http://127.0.0.1:5173](http://127.0.0.1:5173)

You should see two messages at the bottom of the page confirming the services are up and running. If you don’t see these, check your terminal logs for any errors.