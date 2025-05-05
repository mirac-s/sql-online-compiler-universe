// static/js/script.js

let editor; // Global variable for Ace Editor instance
let currentLanguage = 'en'; // Default language
const translations = {
    en: {
        page_title: 'Advanced Online SQL Editor',
        main_heading: 'Advanced Online SQL Editor',
        security_warning: '<strong>WARNING:</strong> This is an editor developed for personal or demo use. Directly executing SQL queries received from users is <strong>EXTREMELY DANGEROUS</strong> in real applications without sufficient security measures (input validation, authorization, query analysis, isolated environments). This example uses an in-memory database and resets on server restart. <strong>DO NOT USE</strong> with sensitive data without security measures!',
        settings_button: 'Settings',
        clear_button: 'Clear',
        run_button: 'Run',
        results_heading: 'Results',
        results_placeholder: 'Results will appear here after executing the query.',
        settings_heading: 'Settings',
        setting_theme: 'Theme:',
        theme_dark: 'Dark',
        theme_light: 'Light',
        setting_font_size: 'Font Size:',
        setting_font_family: 'Font Family:',
        setting_language: 'Language:',
        settings_save: 'Save Settings',
        query_success_no_results: 'Query executed successfully, no results returned.',
        unexpected_server_response: 'Unexpected server response received.',
        request_error: 'An error occurred during the request:',
        invalid_request: 'Invalid request: Query not found.' // Should ideally come from backend, but can be frontend fallback
    },
    tr: {
        page_title: 'Gelişmiş Online SQL Editörü',
        main_heading: 'Gelişmiş Online SQL Editörü',
         security_warning: '<strong>UYARI:</strong> Bu, kişisel kullanım veya demo amaçlı geliştirilmiş bir editördür. Kullanıcıdan alınan SQL sorgularını doğrudan çalıştırmak, yeterli güvenlik önlemleri (giriş doğrulama, yetkilendirme, sorgu analizi, izole ortamlar) olmadan gerçek uygulamalarda <strong>SON DERECE GÜVENLİKSİZDİR</strong>. Bu örnek, bellek içi (in-memory) bir veritabanı kullanır ve sunucu yeniden başlatıldığında sıfırlanır. Güvenlik önlemleri olmadan hassas verilerle <strong>KULLANMAYIN</strong>!',
        settings_button: 'Ayarlar',
        clear_button: 'Temizle',
        run_button: 'Çalıştır',
        results_heading: 'Sonuçlar',
        results_placeholder: 'Sorguyu çalıştırdıktan sonra sonuçlar burada görünecektir.',
        settings_heading: 'Ayarlar',
        setting_theme: 'Tema:',
        theme_dark: 'Koyu',
        theme_light: 'Açık',
        setting_font_size: 'Yazı Boyutu:',
        setting_font_family: 'Yazı Tipi:',
        setting_language: 'Dil:',
        settings_save: 'Ayarları Kaydet',
        query_success_no_results: 'Sorgu başarıyla çalıştırıldı veya sonuç döndürmedi.',
        unexpected_server_response: 'Beklenmedik bir sunucu yanıtı alındı.',
        request_error: 'İstek sırasında bir hata oluştu:',
         invalid_request: 'Geçersiz istek: Sorgu bulunamadı.' // Should ideally come from backend
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Ace Editor
    editor = ace.edit("editor");
    editor.session.setMode("ace/mode/sql");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: true,
        enableAutoIndent: true,
        enableStructureHighlighting: true,
        showPrintMargin: false,
        // Autoclose brackets/quotes are often enabled by snippets or modes
    });

    // --- Load Settings ---
    loadSettings();

    // --- Button Event Listeners ---
    document.getElementById('clear-button').addEventListener('click', clearEditor);
    document.getElementById('run-button').addEventListener('click', executeQuery);
    document.getElementById('settings-button').addEventListener('click', openSettingsModal);
    document.getElementById('save-settings-button').addEventListener('click', saveSettings);

    // --- Settings Modal ---
    const settingsModal = document.getElementById('settings-modal');
    const closeButton = settingsModal.querySelector('.close-button');

    closeButton.addEventListener('click', closeSettingsModal);
    window.addEventListener('click', outsideModalClick); // Close modal when clicking outside

    function openSettingsModal() {
        // Populate settings modal with current values before opening
        document.getElementById('theme-select').value = localStorage.getItem('theme') || 'dark';
        document.getElementById('font-size-select').value = localStorage.getItem('fontSize') || '16px';
        document.getElementById('font-family-select').value = localStorage.getItem('fontFamily') || "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace";
        document.getElementById('language-select').value = localStorage.getItem('language') || 'en';


        settingsModal.style.display = 'block';
    }

    function closeSettingsModal() {
        settingsModal.style.display = 'none';
    }

    function outsideModalClick(event) {
        if (event.target === settingsModal) {
            closeSettingsModal();
        }
    }

    function saveSettings() {
        const theme = document.getElementById('theme-select').value;
        const fontSize = document.getElementById('font-size-select').value;
        const fontFamily = document.getElementById('font-family-select').value;
        const language = document.getElementById('language-select').value;

        localStorage.setItem('theme', theme);
        localStorage.setItem('fontSize', fontSize);
        localStorage.setItem('fontFamily', fontFamily);
        localStorage.setItem('language', language);

        applySettings(theme, fontSize, fontFamily, language);
        closeSettingsModal();
    }

    function loadSettings() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedFontSize = localStorage.getItem('fontSize') || '16px';
        const savedFontFamily = localStorage.getItem('fontFamily') || "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace";
        const savedLanguage = localStorage.getItem('language') || 'en';

        applySettings(savedTheme, savedFontSize, savedFontFamily, savedLanguage);
    }

    function applySettings(theme, fontSize, fontFamily, language) {
        // Apply Theme
        const body = document.body;
        if (theme === 'dark') {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            editor.setTheme("ace/theme/monokai"); // Ace dark theme
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            editor.setTheme("ace/theme/chrome"); // Ace light theme (or another suitable)
        }

        // Apply Font Size
        editor.setFontSize(fontSize);

        // Apply Font Family
         editor.setOptions({
            fontFamily: fontFamily
         });


        // Apply Language
        updateLanguage(language);
    }

    // --- Language Switching ---
    function updateLanguage(lang) {
        currentLanguage = lang;
        const elements = document.querySelectorAll('[data-lang-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                // Handle special cases like innerHTML for warnings
                if (element.classList.contains('warning')) {
                     element.innerHTML = translations[currentLanguage][key];
                } else {
                    element.textContent = translations[currentLanguage][key];
                }
            }
        });
         // Update results placeholder separately as it's dynamically set
         const resultsArea = document.getElementById('results-area');
         const resultsPlaceholder = resultsArea.querySelector('p');
         if (resultsPlaceholder && resultsPlaceholder.getAttribute('data-lang-key') === 'results_placeholder') {
              resultsPlaceholder.textContent = translations[currentLanguage]['results_placeholder'];
         }
         // Update modal heading separately
         const modalHeading = document.querySelector('#settings-modal .modal-content h2');
         if (modalHeading && modalHeading.getAttribute('data-lang-key') === 'settings_heading') {
             modalHeading.textContent = translations[currentLanguage]['settings_heading'];
         }
         // Update select option texts (simple approach for demo)
         document.querySelector('#theme-select option[value="dark"]').textContent = translations[currentLanguage]['theme_dark'];
         document.querySelector('#theme-select option[value="light"]').textContent = translations[currentLanguage]['theme_light'];
         document.querySelector('#language-select option[value="en"]').textContent = 'English'; // Keep native name
         document.querySelector('#language-select option[value="tr"]').textContent = 'Türkçe'; // Keep native name


    }


    // --- Clear Button Functionality ---
    function clearEditor() {
        editor.setValue(''); // Clear Ace Editor content
    }


}); // End DOMContentLoaded

// --- Execute Query Function (outside DOMContentLoaded if it needs global access) ---
async function executeQuery() {
    const query = editor.getValue(); // Get content from Ace Editor
    const resultsArea = document.getElementById('results-area');
     const runButton = document.getElementById('run-button');

    resultsArea.innerHTML = `<h2>${translations[currentLanguage]['results_heading']}</h2><p>${translations[currentLanguage]['request_error'].split(':')[0] + 'tırılıyor...'}</p>`; // Simple "Running..." message
    runButton.disabled = true; // Disable button while running

    try {
        const response = await fetch('/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
        });

        const data = await response.json();

        if (data.error) {
            resultsArea.innerHTML = `<h2>${translations[currentLanguage]['results_heading']}</h2><pre>${escapeHTML(data.error)}</pre>`;
            resultsArea.style.color = 'var(--warning-color)'; // Use CSS variable
        } else if (data.results) {
            let html = `<h2>${translations[currentLanguage]['results_heading']}</h2>`;
            if (data.results.length === 0) {
                html += `<p>${translations[currentLanguage]['query_success_no_results']}</p>`; // Updated message
            } else {
                // Assuming all rows have the same columns
                const columns = Object.keys(data.results[0]);
                html += '<table><thead><tr>';
                columns.forEach(col => {
                    html += `<th>${escapeHTML(col)}</th>`;
                });
                html += '</tr></thead><tbody>';

                data.results.forEach(row => {
                    html += '<tr>';
                    columns.forEach(col => {
                        html += `<td>${escapeHTML(row[col])}</td>`;
                    });
                    html += '</tr>';
                });
                html += '</tbody></table>';
            }
            resultsArea.innerHTML = html;
             resultsArea.style.color = 'var(--text-color)'; // Use CSS variable for default color
        } else {
             // Handle cases where the backend doesn't return 'error' or 'results'
             resultsArea.innerHTML = `<h2>${translations[currentLanguage]['results_heading']}</h2><pre>${translations[currentLanguage]['unexpected_server_response']}</pre>`;
             resultsArea.style.color = 'var(--warning-color)';
        }

    } catch (error) {
        resultsArea.innerHTML = `<h2>${translations[currentLanguage]['results_heading']}</h2><pre>${translations[currentLanguage]['request_error']} ${escapeHTML(error.message)}</pre>`;
        resultsArea.style.color = 'var(--warning-color)';
    } finally {
         runButton.disabled = false; // Re-enable button
    }
}

// Helper function to prevent XSS when displaying results/errors
function escapeHTML(str) {
    if (str === null || str === undefined) return ''; // Handle null/undefined
    return String(str).replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#039;');
}


//Powered by GitHub.com/mirac-s
