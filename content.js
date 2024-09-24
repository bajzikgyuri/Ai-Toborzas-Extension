// content.js

(function () {
  // Utility function to extract the ID from the URL
  function getMyIdFromUrl(url) {
    if (!url) {
      console.error('URL is undefined');
      return null;
    }
    const match = url.match(/\/(?:toborzas|toborzasok)\/([a-z0-9-]+)/);
    if (match) {
      return match[1];
    }
    return null;
  }

  // Function to wait for an element to be available in the DOM
  function waitForElement(selector) {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  // Function to add a button to the header
  async function addButtonToHeader() {
    const url = window.location.href;
    const id = getMyIdFromUrl(url);
    if (!id) return;

    let headerElement;
    if (url.includes('/toborzasok/')) {
      // Wait for the header element to be available
      headerElement = await waitForElement(
        '#__next > div > div:nth-child(1) > div:nth-child(2) > div > div > div > div:nth-child(1)'
      );
    } else if (url.includes('/toborzas/')) {
      headerElement = await waitForElement('#main-content > header > div.actions');
    } else {
      return;
    }

    if (!headerElement) {
      console.error('Header element not found');
      return;
    }

    // Remove existing button if any
    removeButton();

    const buttonContainer = createButtonContainer();
    const button = createButton();

    buttonContainer.appendChild(button);

    if (url.includes('/toborzasok/')) {
      headerElement.style.display = 'flex';
      headerElement.style.alignItems = 'center';
      headerElement.style.justifyContent = 'center';
      headerElement.appendChild(buttonContainer);
    } else if (url.includes('/toborzas/')) {
      headerElement.insertBefore(buttonContainer, headerElement.firstChild);
    }

    // Add click event listener to the button
    button.addEventListener('click', () => handleButtonClick(buttonContainer, button));

    // Initial check to set button state
    updateButtonState(button);
  }

  // Function to remove the button if it exists
  function removeButton() {
    const existingButton = document.querySelector('#ai-toborzas-start-button');
    if (existingButton) {
      existingButton.remove();
    }
  }

  // Function to check if "Megjegyzés/egyéb infó" field contains "||AI-TOBORZOTT||"
  async function checkMegjegyzesField() {
    const url = window.location.href;

    if (url.includes('/toborzas/')) {
      // On /toborzas/ page, select the textarea with field="m_megjegyzes_egyeb"
      const megjegyzesSelector = 'textarea[field="m_megjegyzes_egyeb"]';
      const megjegyzesField = await waitForElement(megjegyzesSelector);
      if (!megjegyzesField) {
        console.error('Megjegyzés/egyéb infó field not found on /toborzas/ page.');
        return false;
      }

      const value = megjegyzesField.value || '';
      return value.includes('||AI-TOBORZOTT||');
    } else if (url.includes('/toborzasok/')) {
      // On /toborzasok/ page
      const megjegyzesValue = await getMegjegyzesValueFromToborzasokPage();
      return megjegyzesValue.includes('||AI-TOBORZOTT||');
    }

    return false;
  }

  // Function to get the value of "Megjegyzés" field on /toborzasok/ page
  async function getMegjegyzesValueFromToborzasokPage() {
    // Wait for the Megjegyzés sections to be available
    await waitForElement('div.MuiGrid-item');
    const megjegyzesSections = document.querySelectorAll('div.MuiGrid-item');
    for (const section of megjegyzesSections) {
      const h6 = section.querySelector('h6');
      if (h6 && h6.textContent.trim() === 'Megjegyzés') {
        const p = section.querySelector('p');
        if (p) {
          return p.textContent || '';
        }
      }
    }
    console.error('Megjegyzés section not found on /toborzasok/ page.');
    return '';
  }

  // Function to create button container
  function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'v-button secondary rounded ai-toborzas-start-button';
    buttonContainer.id = 'ai-toborzas-start-button';
    return buttonContainer;
  }

  // Function to create the button
  function createButton() {
    const button = document.createElement('button');
    button.className = 'button align-center icon normal ai-toborzas-button';
    button.type = 'button';
    button.innerHTML =
      '<span class="content"><span class="v-icon"><i data-icon="magic_wand">🪄</i></span></span>';
    return button;
  }

  // Function to handle button click
  function handleButtonClick(buttonContainer, button) {
    const myId = getMyIdFromUrl(window.location.href);
    if (myId) {
      showLoading(buttonContainer);
      fetch(
        `https://prod-n8n.polandcentral.cloudapp.azure.com/webhook/ai-toborzas-start-from-sales?toborzas_id=${myId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error occurred: ${response.status} ${response.statusText}`);
          }
          return response.text();
        })
        .then((text) => {
          // Display the response message in a modal dialog
          displayModal(text);
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          displayError(error.message);
        })
        .finally(() => {
          hideLoading(buttonContainer, button);
          updateButtonState(button); // Re-check the field and update the button state if necessary
        });
    }
  }

  // Function to update the button state based on "Megjegyzés/egyéb infó" field
  async function updateButtonState(button) {
    const shouldDisableButton = await checkMegjegyzesField();
    if (shouldDisableButton) {
      button.disabled = true;
      button.title = 'A folyamat már elindult.';
      // Use the provided SVG as the icon
      const checkmarkSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 792" width="40" height="40">
          <g>
            <path fill="#41AD49" d="M562,396c0-141.4-114.6-256-256-256S50,254.6,50,396s114.6,256,256,256S562,537.4,562,396L562,396z M501.7,296.3l-241,241l0,0l-17.2,17.2L110.3,421.3l58.8-58.8l74.5,74.5l199.4-199.4L501.7,296.3L501.7,296.3z"/>
          </g>
        </svg>
      `;
      button.innerHTML = `<span class="content">${checkmarkSVG}</span>`;
      button.classList.add('green-check-button');
    } else {
      button.disabled = false;
      button.title = 'AI Toborzás indítása';
      // Restore original icon
      button.innerHTML =
        '<span class="content"><span class="v-icon"><i data-icon="magic_wand">🪄</i></span></span>';
      button.classList.remove('green-check-button');
    }
  }

  // Function to show loading spinner
  function showLoading(container) {
    const loader = document.createElement('div');
    loader.className = 'loader';
    container.innerHTML = '';
    container.appendChild(loader);
  }

  // Function to hide loading spinner
  function hideLoading(container, button) {
    container.innerHTML = '';
    container.appendChild(button);
  }

  // Function to display plain text in a modal dialog
  function displayModal(message) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';

    const messageElement = document.createElement('div');
    messageElement.className = 'modal-message';
    messageElement.textContent = message;

    const okButton = document.createElement('button');
    okButton.className = 'button-primary';
    okButton.textContent = 'OK';
    okButton.addEventListener('click', () => {
      overlay.remove();
    });

    modalContainer.appendChild(messageElement);
    modalContainer.appendChild(okButton);
    overlay.appendChild(modalContainer);

    document.body.appendChild(overlay);
  }

  // Function to display error in an overlay
  function displayError(errorMessage) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const errorContainer = document.createElement('div');
    errorContainer.className = 'modal-container';

    const errorText = document.createElement('div');
    errorText.className = 'modal-message';
    errorText.textContent = errorMessage || 'An unknown error occurred.';

    const closeButton = document.createElement('button');
    closeButton.className = 'button-primary';
    closeButton.textContent = 'Bezárás';
    closeButton.addEventListener('click', () => {
      overlay.remove();
    });

    errorContainer.appendChild(errorText);
    errorContainer.appendChild(closeButton);
    overlay.appendChild(errorContainer);

    document.body.appendChild(overlay);
  }

  // Function to initialize the script
  function init() {
    let lastUrl = '';
    setInterval(async () => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        // Check if the URL matches
        const id = getMyIdFromUrl(currentUrl);
        if (id) {
          addButtonToHeader();
        } else {
          removeButton();
        }
      } else {
        // Even if the URL hasn't changed, check if the button needs to update its state
        const button = document.querySelector('#ai-toborzas-start-button .ai-toborzas-button');
        if (button) {
          updateButtonState(button);
        }
      }
    }, 1000);
  }

  // Initialize the script
  init();
})();