const generateForm = document.querySelector(".generate-form");
    const ImageGallery = document.querySelector(".image-gallery");

    generateForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const userPrompt = event.target.querySelector(".prompt-input").value;
      const userImageQuantity = event.target.querySelector(".img-quantity").value;
      const loaderImageUrl = "/static/images/blocks-scale.svg";

      try {
        // Display loading state
        const imgCardMarkup = Array.from({ length: userImageQuantity }, () => `
          <div class="image-gallery">
            <img src="${loaderImageUrl}" alt="loading">
          </div>
        `).join("");
        ImageGallery.innerHTML = imgCardMarkup;

        // Call the backend API
        const response = await fetch("http://localhost:5000/generate-image", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              prompt: userPrompt,
              n: parseInt(userImageQuantity),
          }),
      });
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate image");
      }
      
      const { image_url } = await response.json();
      
      // Display the image in the gallery
      ImageGallery.innerHTML = `
      <div class="img-card">
          <img src="${image_url}" alt="Generated Image">
          <a href="${image_url}" class="download-btn" download>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
              </svg>
          </a>
      </div>
    `;
    
      

      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });