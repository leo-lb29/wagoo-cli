import { Command } from "commander";
import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";
import { fileURLToPath } from "url";
import path from "path";

const program = new Command();

// Create the interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to check if a command is available
const checkCommand = (cmd) => {
  try {
    execSync(cmd, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

// Check if the installation has already been done
const checkIfInstalled = () => {
  const baxooConfigPath = path.resolve("baxoo-app", ".baxoo", "config.json");

  if (fs.existsSync(baxooConfigPath)) {
    const configContent = fs.readFileSync(baxooConfigPath, "utf-8");
    const config = JSON.parse(configContent);
    if (config.status === "installed") {
      console.log("⚠️ The project is already installed.");
      return true;
    }
  }
  return false;
};

// Command to install dependencies and configure the project
program
  .command("new")
  .description("Install dependencies and configure the project")
  .action(() => {
    try {
      // Check if the project is already installed
      if (checkIfInstalled()) {
        console.log(
          "❌ Aborting installation, as the project is already installed."
        );
        rl.close();
        process.exit(1);
      }

      const repoPath = "baxoo-app"; // Path where the repo should be cloned

      // Check if the repository directory already exists
      if (fs.existsSync(repoPath)) {
        const files = fs.readdirSync(repoPath);
        if (files.length > 0) {
          console.error(
            `❌ The directory '${repoPath}' is not empty. Please ensure it's empty before cloning.`
          );
          process.exit(1);
        }
        console.log(
          `⚠️ The directory '${repoPath}' already exists but is empty, proceeding with clone...`
        );
      } else {
        console.log(
          `🔄 Directory '${repoPath}' does not exist, proceeding with clone...`
        );
      }

      console.log("📥 Cloning the repository...");
      try {
        execSync("git clone https://github.com/leo-lb29/baxoo-app.git", {
          stdio: "inherit",
        });
        console.log("✅ Repo 'baxoo-app' cloned successfully.");

        // Install dependencies for the main project
        console.log("📦 Installing dependencies...");
        process.chdir("baxoo-app/dash");
        execSync("npm install", { stdio: "ignore" });
        execSync("composer install", { stdio: "ignore" });

        process.chdir("baxoo-app/app_desktop");
        execSync("npm install", { stdio: "ignore" });
        execSync("composer install", { stdio: "ignore" });
        app_desktop;

        // Configure the .env file
        console.log("⚙️ Configuring the application...");
        process.chdir("allcode/config");
        fs.copyFileSync(".env.example", ".env");

        // Install dependencies for the static project
        console.log("📦 Installing static project dependencies...");
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const staticPath = path.resolve(__dirname, "baxoo-app/static/v1/dash");

        if (fs.existsSync(staticPath)) {
          process.chdir(staticPath);
          execSync("npm install", { stdio: "ignore" });
        } else {
          console.error(`❌ Directory ${staticPath} does not exist.`);
          process.exit(1);
        }

        // Mark the installation as completed with a JSON file

        // Créer le dossier .baxoo dans baxoo-app
        if (!fs.existsSync(path.resolve(__dirname, "baxoo-app", ".baxoo"))) {
          fs.mkdirSync(path.resolve(__dirname, "baxoo-app", ".baxoo"));
        }

        // Configuration à écrire dans le fichier config.json
        const config = {
          status: "installed",
        };

        // Écrire le fichier config.json dans les deux dossiers .baxoo
        fs.writeFileSync(
          path.resolve(__dirname, "baxoo-app", ".baxoo", "config.json"),
          JSON.stringify(config, null, 2)
        );

        console.log("🎉 Installation completed!");

        rl.close();
        process.exit(0);
      } catch (error) {
        console.log(
          "❌ You do not have permission to clone the Baxoo repository."+error
        );
        process.exit(1);
      }
    } catch (error) {
      console.error("❌ An error occurred during installation.");
      console.error(error);
      rl.close();
      process.exit(1);
    }
  });

// Command to build the project for Windows
// program
//   .command("build")
//   .description("Build the project")
//   .option("-w, --win", "Build the project for Windows")
//   .action((cmd) => {
//     try {
//       if (cmd.win) {
//         console.log("🔨 Building the project for Windows...");
//         // Ajoute ta logique de construction pour Windows ici
//       } else {
//         console.log("🔨 Building the project...");
//         // Ajoute ta logique de construction générique ici
//       }
//       console.log("✅ Build completed successfully.");
//       process.exit(1);
//     } catch (error) {
//       console.error("❌ An error occurred during the build process.");
//       console.error(error);
//       process.exit(1);
//     }
//   });
program
  .command("css")
  .description("Build the TailwindCSS project")
  .option("-b, --build", "Execute the build action")  // Ajoute l'option --build
  .action((cmd) => {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const baxooDir = path.resolve(__dirname, ".baxoo");

      // Vérifie si le dossier .baxoo est présent dans le répertoire actuel
      if (!fs.existsSync(baxooDir)) {
        console.error(
          "❌ Vous devez être dans un projet Baxoo pour exécuter cette commande."
        );
        process.exit(1);
      }

      // Si l'option --build est présente, on effectue une action différente
      if (cmd.build) {
        console.log("🚀 Starting the custom build action...");

        // Ajoute ici la logique personnalisée pour le build
        // Exemple : execSync("npm run build", { stdio: 'inherit' });
      } else {
        console.log("📦 Building the TailwindCSS...");

        // Utiliser la commande TailwindCSS via execSync
        execSync(
          "npx tailwindcss -i ./src/input.css -o ./src/output.css --watch",
          { stdio: "inherit" }
        );
      }

      console.log("✅ Build completed successfully.");
    } catch (error) {
      console.error("❌ An error occurred during the build process.");
      console.error(error);
      process.exit(1);
    }
  });


program.parse(process.argv);
