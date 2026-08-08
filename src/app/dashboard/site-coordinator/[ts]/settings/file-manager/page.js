"use client";
import { useState } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";

const Page = () => {
  const [files, setFiles] = useState([
    {
      name: "Documents",
      isDirectory: true,
      path: "/Documents",
      updatedAt: "2025-10-22T10:30:00Z",
    },
    {
      name: "Pictures",
      isDirectory: true,
      path: "/Pictures",
      updatedAt: "2025-10-22T11:00:00Z",
    },
  ]);

  const [currentPath, setCurrentPath] = useState("/");

  // Debug: Log current files and state
  console.log("Current files:", files);
  console.log("Current path:", currentPath);

  // --- Create Folder ---
  const handleCreate = (name) => {
    const newPath = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`;
    const newFolder = {
      name,
      isDirectory: true,
      path: newPath,
      updatedAt: new Date().toISOString(),
    };
    setFiles((prev) => [...prev, newFolder]);
  };

  // --- Delete ---
  const handleDelete = (items) => {
    const toDelete = new Set(items.map((i) => i.path));
    setFiles((prev) =>
      prev.filter(
        (f) =>
          !toDelete.has(f.path) &&
          !Array.from(toDelete).some((p) => f.path.startsWith(p + "/"))
      )
    );
  };

  // --- Rename ---
  const handleRename = (item, newName) => {
    const oldPath = item.path;
    const newPath =
      oldPath.substring(0, oldPath.lastIndexOf("/") + 1) + newName;

    setFiles((prev) =>
      prev.map((file) => {
        if (file.path === oldPath) {
          return { ...file, name: newName, path: newPath };
        }
        if (item.isDirectory && file.path.startsWith(oldPath + "/")) {
          const rest = file.path.substring(oldPath.length);
          return { ...file, path: newPath + rest };
        }
        return file;
      })
    );
  };

  // --- Move ---
  const handleMove = (items, target) => {
    const targetPath = target.path;
    setFiles((prev) =>
      prev.map((file) => {
        const moving = items.find((i) => i.path === file.path);
        if (moving) {
          const newPath =
            targetPath === "/" ? `/${file.name}` : `${targetPath}/${file.name}`;
          return { ...file, path: newPath };
        }
        for (const moved of items) {
          if (moved.isDirectory && file.path.startsWith(moved.path + "/")) {
            const relative = file.path.substring(moved.path.length);
            const newParent =
              targetPath === "/"
                ? `/${moved.name}`
                : `${targetPath}/${moved.name}`;
            return { ...file, path: newParent + relative };
          }
        }
        return file;
      })
    );
  };

  // --- FIXED Upload Function ---
  const handleUpload = async (browserFiles, targetDir) => {
    console.log("=== UPLOAD TRIGGERED ===");
    console.log("Files to upload:", browserFiles);
    console.log("Target directory:", targetDir);
    console.log("Current path:", currentPath);

    if (!browserFiles || browserFiles.length === 0) {
      console.error("No files provided for upload");
      return [];
    }

    const uploadPath = targetDir?.path || currentPath;
    console.log("Final upload path:", uploadPath);

    // Create new file entries
    const newEntries = Array.from(browserFiles).map((file) => {
      const filePath =
        uploadPath === "/"
          ? `/${file.name}`
          : `${uploadPath}/${file.name}`.replace(/\/+/g, "/");

      return {
        id: Math.random().toString(36).substr(2, 9), // Add unique ID
        name: file.name,
        isDirectory: false,
        path: filePath,
        updatedAt: new Date().toISOString(),
        size: file.size,
        type: file.type,
      };
    });

    console.log("New entries to add:", newEntries);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update state
    setFiles((prevFiles) => {
      const existingPaths = new Set(prevFiles.map((f) => f.path));
      const uniqueNewEntries = newEntries.filter(
        (entry) => !existingPaths.has(entry.path)
      );
      const updatedFiles = [...prevFiles, ...uniqueNewEntries];

      console.log("Previous files count:", prevFiles.length);
      console.log("New files count:", updatedFiles.length);
      console.log("All files after upload:", updatedFiles);

      return updatedFiles;
    });

    return newEntries;
  };

  // --- Download ---
  const handleDownload = (file) => {
    console.log("Download triggered for:", file.name);
    alert(`Simulated download for: ${file.name}`);
  };

  // --- Navigate ---
  const handleNavigate = (path) => {
    console.log("Navigation to:", path);
    setCurrentPath(path);
  };

  return (
    <div className="mb-10">
      <FileManager
        files={files}
        path={currentPath}
        onNavigate={handleNavigate}
        onCreateFolder={handleCreate}
        onDelete={handleDelete}
        onRename={handleRename}
        onMove={handleMove}
        onUpload={handleUpload}
        onDownload={handleDownload}
        uploadUrl={false} // Try this
        collapsibleNav={true}
        defaultNavExpanded={false}
        capabilities={{
          canCreate: true,
          canDelete: true,
          canRename: true,
          canMove: true,
          canUpload: true,
          canDownload: true,
          canSelect: true,
        }}
        selection={{
          mode: "multiple",
        }}
      />
    </div>
  );
};

export default Page;
