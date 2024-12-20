const folderImageCount = {
    "Epic": 58,
    "Starter": 7,
    "Rare": 14,
    "Full-Item": 106,
    "ChoGath-Extra": 56,
    "Buff": 9,
  };
  
  let rollCount = 0; // Track the number of rolls
  let lockButton = false; // Lock for the "Choose Images" button
  let lastRollImages = []; // Store the images from the last roll
  let imageLock = false;  // Lock for the individual images (to allow only 1 click per roll)
  let clickedImage = null; // Track the clicked image for the current roll
  let collectedItems = []; // Store collected items
  
  // Function to randomly select and display images
  function selectAndDisplayImages() {
    if (lockButton) return; // Prevent new selection if locked
  
    rollCount++; // Increment the roll count
  
    // Lock the button for 20 seconds
    lockButton = true;
    document.getElementById("chooseButton").classList.add("disabled");
  
    // Filter folders based on the roll count
    const availableFolders = Object.keys(folderImageCount).filter(folder => {
      if (rollCount === 1) return folder === "Starter"; // Only allow "Starter" on roll 0
      if (folder === "Full-Item" && rollCount <= 6) return false; // Allow "Full-Item" only after roll 6
      if (folder === "Buff" && rollCount <= 7) return false; // Allow "Buff" only after roll 7
      return folder !== "Starter"; // Exclude "Starter" on subsequent rolls
    });
  
    // Randomly choose a folder
    const selectedFolder = availableFolders[Math.floor(Math.random() * availableFolders.length)];
  
    // Get the maximum image count for the selected folder
    const maxImageCount = folderImageCount[selectedFolder];
  
    // Randomly select 3 images (1 to maxImageCount) from the chosen folder
    const images = Array.from({ length: 3 }, () => `${selectedFolder}/${Math.ceil(Math.random() * maxImageCount)}.png`);
  
    // Update the lastRollImages with the new set
    lastRollImages = images;
  
    // Reset the clicked image for the new roll
    clickedImage = null;
  
    // Update the main image elements
    document.getElementById("image1").src = images[0];
    document.getElementById("image2").src = images[1];
    document.getElementById("image3").src = images[2];
  
    // Lock the images for 20 seconds (disable clicking)
    imageLock = true;
  
    // Wait for 20 seconds before re-enabling the button
    setTimeout(() => {
      lockButton = false;
      imageLock = false;
      document.getElementById("chooseButton").classList.remove("disabled");
    }, 20000); // 20 seconds lock time
  }
  
  // Function to show a small preview of the clicked image in the bottom corner
  function showSmallPreview(imgElement) {
    if (imageLock) {
      if (clickedImage) {
        alert("You can only select one image per roll.");
        return;
      }
    }
  
    if (clickedImage) {
      alert("You have already selected an image. Wait for the next roll.");
      return; // Prevent clicking on other images after one has been selected
    }
  
    // Mark the image as clicked
    clickedImage = imgElement.src;
  
    if (collectedItems.length < 6) {
      // Add to collected items directly if less than 6
      addCollectedItem(imgElement.src);
    } else {
      // Prompt user to choose an item to remove
      promptRemoveItem(imgElement.src);
    }
  }
  
  // Function to add a collected item to the bottom preview container
  function addCollectedItem(itemSrc) {
    collectedItems.push(itemSrc); // Add to collected items array
  
    const previewContainer = document.getElementById("smallImagePreviewContainer");
  
    // Create a new image element for the preview
    const previewImg = document.createElement("img");
    previewImg.src = itemSrc;
    previewImg.classList.add("small-image");
  
    // Append the preview image to the container
    previewContainer.appendChild(previewImg);
  }
  
  // Function to prompt the user to remove an existing item
  function promptRemoveItem(newItemSrc) {
    // Create a modal or prompt with the current collected items
    const modal = document.createElement("div");
    modal.classList.add("modal");
  
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
  
    const modalHeader = document.createElement("h3");
    modalHeader.innerText = "Select an item to replace:";
    modalContent.appendChild(modalHeader);
  
    // Add the current items to the modal for selection
    collectedItems.forEach((item, index) => {
      const itemImg = document.createElement("img");
      itemImg.src = item;
      itemImg.classList.add("modal-image");
      itemImg.onclick = () => {
        replaceItem(index, newItemSrc); // Replace the selected item
        document.body.removeChild(modal); // Remove the modal
      };
      modalContent.appendChild(itemImg);
    });
  
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
  
  // Function to replace an existing item with a new one
  function replaceItem(index, newItemSrc) {
    collectedItems[index] = newItemSrc; // Replace the item in the array
  
    const previewContainer = document.getElementById("smallImagePreviewContainer");
    previewContainer.innerHTML = ""; // Clear the container
  
    // Re-add all items to the preview container
    collectedItems.forEach(itemSrc => addCollectedItem(itemSrc));
  }
  