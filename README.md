## Hellocat
**A Vanilla JS + Firebase Chat!

---

### Overview  
**Hellocat** is a lightweight, real-time chat application built with vanilla JavaScript and Firebase. It allows users to chat instantly with easy-to-use features like media sharing and smooth UI interactions.

---

### Project Setup  
1. Clone the repository from GitHub:  
   ```bash
   git clone https://github.com/2dprototype/Hellocat.git
   cd Hellocat
   ```

2. Add your Firebase configuration in the project.  

3. Launch the app using a local server:
   ```bash
   npx http-server
   ```
   Access the app at `http://localhost:8080`.

---

### Libraries Used  
Below are the libraries integrated into Hellocat for various features:

1. **UI/UX and Interaction:**
   - **jQuery** (`jquery.min.js`): DOM manipulation and AJAX.
   - **jQuery UI** (`jquery-ui.min.js`): Adds UI components and effects.
   - **Clipboard.js** (`clipboard.min.js`): Copy text to the clipboard.
   - **Cropper.js** (`cropper.min.js`): Crop images directly in the browser.
   - **Highlight.js** (`highlight.min.js`): Code syntax highlighting.
   - **long-press-event.js** (`long-press-event.min.js`): Long press detection.
   - **KaTeX** (`katex.min.js`): Render math expressions in chats.
   - **jQuery HighlightTextarea** (`jquery.highlighttextarea.min.js`): Highlight text inside textareas.

2. **Media Handling:**
   - **Webcam.js** (`webcam.min.js`): Capture and upload images.
   - **Recorder.js** (`recorder.js`): Record audio in-browser.

3. **File and Data Handling:**
   - **CryptoJS** (`crypto-js.min.js`): Data encryption.
   - **FileSaver.js** (`FileSaver.min.js`): Save files from the browser.
   - **SparkMD5** (`spark-md5.min.js`): Generate MD5 hashes.
   - **UA Parser** (`ua-parser.min.js`): Detect user agents.

4. **Graphing and Visuals:**
   - **Chart.js** (`Chart.min.js`): Display charts and graphs.
   - **Three.js** (`three.min.js`): Render 3D models in the chat.

5. **Routing:**
   - **Router.js** (`router.js`): Manage client-side routes.

6. **Application Info Parser:**
   - **app-info-parser.js:** Extract application details.

---

### Credits  
Special thanks to the authors of the following open-source libraries:  
- [jQuery](https://jquery.com/)  
- [Chart.js](https://www.chartjs.org/)  
- [Three.js](https://threejs.org/)  
- [CryptoJS](https://crypto-js.googlecode.com/)  
- [KaTeX](https://katex.org/)  
- [Clipboard.js](https://clipboardjs.com/)  

---

### License  
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). 