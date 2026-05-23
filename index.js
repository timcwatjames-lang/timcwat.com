document.addEventListener('DOMContentLoaded', function () {

    // ===== Service Worker Registration =====
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(function () {});
    }

    // ===== Nav Toggle =====
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
        });

        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('open');
            }
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
            });
        });
    }

    // ===== Playground =====
    var htmlEditor = document.getElementById('htmlEditor');
    var previewArea = document.getElementById('previewArea');
    var runBtn = document.getElementById('runBtn');
    var clearBtn = document.getElementById('clearBtn');
    var resetBtn = document.getElementById('resetBtn');
    var lineCount = document.getElementById('lineCount');
    var fullscreenBtn = document.getElementById('fullscreenBtn');

    var defaultCode = '<h1>Hello, World!</h1>\n<p>This is <strong>HTML</strong> in action!</p>\n<ul>\n    <li>Edit this code</li>\n    <li>Click Run to see output</li>\n    <li>Have fun!</li>\n</ul>';

    function runCode() {
        if (!htmlEditor || !previewArea) return;
        var code = htmlEditor.value;
        previewArea.innerHTML = code;
        updateLineCount();
    }

    function updateLineCount() {
        if (!htmlEditor || !lineCount) return;
        var lines = htmlEditor.value.split('\n').length;
        lineCount.textContent = 'Line ' + lines;
    }

    if (htmlEditor && previewArea && runBtn) {
        runBtn.addEventListener('click', runCode);

        htmlEditor.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                runCode();
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;
                this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 4;
            }
        });

        htmlEditor.addEventListener('input', updateLineCount);
    }

    if (clearBtn && htmlEditor && previewArea) {
        clearBtn.addEventListener('click', function () {
            htmlEditor.value = '';
            previewArea.innerHTML = '<p style="color:#999;font-style:italic;">Output will appear here...</p>';
            updateLineCount();
        });
    }

    if (resetBtn && htmlEditor && previewArea) {
        resetBtn.addEventListener('click', function () {
            htmlEditor.value = defaultCode;
            runCode();
        });
    }

    if (fullscreenBtn && previewArea) {
        fullscreenBtn.addEventListener('click', function () {
            var container = previewArea.closest('.playground-output') || previewArea.parentElement;
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
                fullscreenBtn.innerHTML = '&#9974; Exit';
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                fullscreenBtn.innerHTML = '&#9974; Fullscreen';
            }
        });

        document.addEventListener('fullscreenchange', function () {
            if (!document.fullscreenElement && fullscreenBtn) {
                fullscreenBtn.innerHTML = '&#9974; Fullscreen';
            }
        });
    }

    // ===== Starter Templates =====
    var templates = {
        'template-headings': '<h1>Main Heading</h1>\n<h2>Subheading</h2>\n<h3>Section Heading</h3>\n<p>This shows heading levels from h1 to h3.</p>\n<p>Headings create a content hierarchy.</p>',
        'template-list': '<h2>Shopping List</h2>\n<ul>\n    <li>Milk</li>\n    <li>Eggs</li>\n    <li>Bread</li>\n    <li>Fruits</li>\n</ul>\n\n<h2>Steps</h2>\n<ol>\n    <li>Open the store</li>\n    <li>Find items</li>\n    <li>Checkout</li>\n</ol>',
        'template-table': '<table>\n    <tr>\n        <th>Product</th>\n        <th>Price</th>\n        <th>Qty</th>\n    </tr>\n    <tr>\n        <td>Widget</td>\n        <td>$10</td>\n        <td>2</td>\n    </tr>\n    <tr>\n        <td>Gadget</td>\n        <td>$25</td>\n        <td>1</td>\n    </tr>\n</table>',
        'template-form': '<h2>Sign Up</h2>\n<form>\n    <label>Name: <input type="text"></label><br><br>\n    <label>Email: <input type="email"></label><br><br>\n    <label>Password: <input type="password"></label><br><br>\n    <button type="submit">Register</button>\n</form>',
        'template-semantic': '<header>\n    <h1>My Site</h1>\n    <nav>\n        <a href="#">Home</a> |\n        <a href="#">About</a>\n    </nav>\n</header>\n<main>\n    <article>\n        <h2>Blog Post</h2>\n        <p>Content here...</p>\n    </article>\n    <aside>\n        <h3>Related</h3>\n        <p>Sidebar content.</p>\n    </aside>\n</main>\n<footer>\n    <p>&copy; 2026</p>\n</footer>',
        'template-media': '<h2>Media Example</h2>\n<img src="https://picsum.photos/400/200" alt="Random image" style="max-width:100%;border-radius:8px;">\n<figure>\n    <img src="https://picsum.photos/300/150?random=2" alt="Another image" style="max-width:100%;border-radius:6px;">\n    <figcaption>A beautiful scene</figcaption>\n</figure>'
    };

    document.querySelectorAll('.template-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var key = this.dataset.template;
            if (templates[key] && htmlEditor && previewArea) {
                htmlEditor.value = templates[key];
                runCode();
                htmlEditor.focus();

                document.querySelectorAll('.template-btn').forEach(function (b) {
                    b.style.borderColor = '#e8e8e8';
                    b.style.color = '#555';
                });
                this.style.borderColor = '#667eea';
                this.style.color = '#667eea';
            }
        });
    });

    // ===== Copy Button =====
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var codeBlock = this.closest('.demo-code').querySelector('pre code');
            if (!codeBlock) return;
            var text = codeBlock.textContent;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    var orig = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(function () { btn.textContent = orig; }, 2000);
                });
            } else {
                var textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                var orig = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(function () { btn.textContent = orig; }, 2000);
            }
        });
    });

    // ===== Demo Form =====
    var demoForm = document.getElementById('demoForm');
    var formFeedback = document.getElementById('formFeedback');

    if (demoForm && formFeedback) {
        demoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('demoName');
            var email = document.getElementById('demoEmail');
            var message = document.getElementById('demoMessage');

            if (!name || !email || !message) return;

            if (name.value.trim() && email.value.trim() && message.value.trim()) {
                formFeedback.textContent = 'Thanks, ' + name.value.trim() + '! Your message has been sent.';
                formFeedback.className = 'form-feedback show success';
                name.value = '';
                email.value = '';
                message.value = '';
                setTimeout(function () {
                    formFeedback.className = 'form-feedback';
                }, 4000);
            } else {
                formFeedback.textContent = 'Please fill in all fields.';
                formFeedback.className = 'form-feedback show error';
                setTimeout(function () {
                    formFeedback.className = 'form-feedback';
                }, 3000);
            }
        });
    }

    // ===== Sortable Table =====
    document.querySelectorAll('.sort-header').forEach(function (header) {
        header.addEventListener('click', function () {
            var table = this.closest('table');
            var tbody = table.querySelector('tbody');
            if (!tbody) return;

            var rows = Array.from(tbody.querySelectorAll('tr'));
            var index = Array.from(this.parentElement.children).indexOf(this);
            var isAsc = this.dataset.order !== 'asc';

            rows.sort(function (a, b) {
                var aVal = a.children[index].textContent.trim();
                var bVal = b.children[index].textContent.trim();
                var aNum = parseFloat(aVal);
                var bNum = parseFloat(bVal);

                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return isAsc ? aNum - bNum : bNum - aNum;
                }
                return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });

            rows.forEach(function (row) { tbody.appendChild(row); });

            this.dataset.order = isAsc ? 'asc' : 'desc';
            table.querySelectorAll('.sort-header').forEach(function (h) {
                h.querySelector('.sort-indicator').textContent = '\u2195';
            });
            this.querySelector('.sort-indicator').textContent = isAsc ? '\u2193' : '\u2191';
        });
    });

    // ===== Dialog =====
    var demoDialog = document.getElementById('demoDialog');
    var dialogOpenBtn = document.getElementById('dialogOpenBtn');
    var dialogCloseBtn = document.getElementById('dialogCloseBtn');

    if (demoDialog) {
        if (dialogOpenBtn) {
            dialogOpenBtn.addEventListener('click', function () {
                if (typeof demoDialog.showModal === 'function') {
                    demoDialog.showModal();
                } else {
                    demoDialog.setAttribute('open', '');
                }
            });
        }

        if (dialogCloseBtn) {
            dialogCloseBtn.addEventListener('click', function () {
                if (typeof demoDialog.close === 'function') {
                    demoDialog.close();
                } else {
                    demoDialog.removeAttribute('open');
                }
            });
        }

        demoDialog.addEventListener('click', function (e) {
            if (e.target === demoDialog) {
                demoDialog.close();
            }
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== Hidden Attribute Toggle =====
    var toggleHidden = document.getElementById('toggleHidden');
    var hiddenDemo = document.getElementById('hiddenDemo');

    if (toggleHidden && hiddenDemo) {
        toggleHidden.addEventListener('click', function () {
            if (hiddenDemo.hasAttribute('hidden')) {
                hiddenDemo.removeAttribute('hidden');
                toggleHidden.textContent = 'Hide Text';
            } else {
                hiddenDemo.setAttribute('hidden', '');
                toggleHidden.textContent = 'Show Text';
            }
        });
    }

    // ===== Entity Decoder =====
    var entityInput = document.getElementById('entityInput');
    var entityDecodeBtn = document.getElementById('entityDecodeBtn');
    var entityResult = document.getElementById('entityResult');

    if (entityInput && entityDecodeBtn && entityResult) {
        var entityMap = {
            'amp': '\u0026',
            'lt': '\u003C',
            'gt': '\u003E',
            'quot': '\u0022',
            'apos': '\u0027',
            'copy': '\u00A9',
            'reg': '\u00AE',
            'trade': '\u2122',
            'cent': '\u00A2',
            'pound': '\u00A3',
            'euro': '\u20AC',
            'yen': '\u00A5',
            'sect': '\u00A7',
            'para': '\u00B6',
            'times': '\u00D7',
            'divide': '\u00F7',
            'plusmn': '\u00B1',
            'deg': '\u00B0',
            'micro': '\u00B5',
            'middot': '\u00B7',
            'laquo': '\u00AB',
            'raquo': '\u00BB',
            'ndash': '\u2013',
            'mdash': '\u2014',
            'lsquo': '\u2018',
            'rsquo': '\u2019',
            'ldquo': '\u201C',
            'rdquo': '\u201D',
            'bull': '\u2022',
            'hellip': '\u2026',
            'prime': '\u2032',
            'Prime': '\u2033',
            'OElig': '\u0152',
            'oelig': '\u0153',
            'Scaron': '\u0160',
            'scaron': '\u0161',
            'Yuml': '\u0178',
            'circ': '\u02C6',
            'tilde': '\u02DC',
            'ensp': '\u2002',
            'emsp': '\u2003',
            'thinsp': '\u2009',
            'zwnj': '\u200C',
            'zwj': '\u200D',
            'lrm': '\u200E',
            'rlm': '\u200F',
            'sbquo': '\u201A',
            'bdquo': '\u201E',
            'dagger': '\u2020',
            'Dagger': '\u2021',
            'permil': '\u2030',
            'lsaquo': '\u2039',
            'rsaquo': '\u203A',
            'spades': '\u2660',
            'clubs': '\u2663',
            'hearts': '\u2665',
            'diams': '\u2666'
        };

        function decodeEntity() {
            var val = entityInput.value.trim().toLowerCase();
            if (!val) {
                entityResult.innerHTML = 'Enter an entity name above (e.g., amp, copy, lt).';
                return;
            }
            if (entityMap[val] !== undefined) {
                entityResult.innerHTML = '&amp;' + val + '; = <span style="font-size:2rem;margin-left:12px;color:#667eea;">' + entityMap[val] + '</span>';
            } else {
                var num = parseInt(val);
                if (!isNaN(num)) {
                    entityResult.innerHTML = '&amp;#' + num + '; = <span style="font-size:2rem;margin-left:12px;color:#667eea;">' + String.fromCharCode(num) + '</span>';
                } else {
                    entityResult.innerHTML = 'Unknown entity: &amp;' + val + ';';
                }
            }
        }

        entityDecodeBtn.addEventListener('click', decodeEntity);
        entityInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') decodeEntity();
        });
    }

    // ===== SEO Meta Preview =====
    var seoTitle = document.getElementById('seoTitle');
    var seoDesc = document.getElementById('seoDesc');
    var seoPreviewTitle = document.getElementById('seoPreviewTitle');
    var seoPreviewDesc = document.getElementById('seoPreviewDesc');

    function updateSEOPreview() {
        if (seoTitle && seoPreviewTitle) {
            seoPreviewTitle.textContent = seoTitle.value || 'Your Page Title';
        }
        if (seoDesc && seoPreviewDesc) {
            seoPreviewDesc.textContent = seoDesc.value || 'Your page description appears here in search results.';
        }
    }

    if (seoTitle) seoTitle.addEventListener('input', updateSEOPreview);
    if (seoDesc) seoDesc.addEventListener('input', updateSEOPreview);

    // ===== Canvas Drawing =====
    var canvas = document.getElementById('demoCanvas');
    var drawCircleBtn = document.getElementById('drawCircle');
    var drawRectBtn = document.getElementById('drawRect');
    var drawLineBtn = document.getElementById('drawLine');
    var clearCanvasBtn = document.getElementById('clearCanvas');

    if (canvas) {
        var ctx = canvas.getContext('2d');

        function getCanvasContext() {
            return canvas.getContext('2d');
        }

        if (drawCircleBtn) {
            drawCircleBtn.addEventListener('click', function () {
                var c = getCanvasContext();
                c.clearRect(0, 0, canvas.width, canvas.height);
                c.beginPath();
                c.arc(150, 75, 50, 0, Math.PI * 2);
                c.fillStyle = '#667eea';
                c.fill();
                c.strokeStyle = '#764ba2';
                c.lineWidth = 3;
                c.stroke();
            });
        }

        if (drawRectBtn) {
            drawRectBtn.addEventListener('click', function () {
                var c = getCanvasContext();
                c.clearRect(0, 0, canvas.width, canvas.height);
                c.fillStyle = '#28a745';
                c.fillRect(50, 25, 200, 100);
                c.strokeStyle = '#1e7e34';
                c.lineWidth = 3;
                c.strokeRect(50, 25, 200, 100);
            });
        }

        if (drawLineBtn) {
            drawLineBtn.addEventListener('click', function () {
                var c = getCanvasContext();
                c.clearRect(0, 0, canvas.width, canvas.height);
                c.beginPath();
                c.moveTo(30, 30);
                c.lineTo(270, 120);
                c.strokeStyle = '#ff6b6b';
                c.lineWidth = 4;
                c.stroke();
                c.beginPath();
                c.moveTo(30, 120);
                c.lineTo(270, 30);
                c.strokeStyle = '#ffc107';
                c.lineWidth = 4;
                c.stroke();
            });
        }

        if (clearCanvasBtn) {
            clearCanvasBtn.addEventListener('click', function () {
                var c = getCanvasContext();
                c.clearRect(0, 0, canvas.width, canvas.height);
            });
        }
    }

    // ===== Initialize =====
    if (htmlEditor && previewArea) {
        runCode();
    }

    // ===== Code Challenges =====
    document.querySelectorAll('.challenge').forEach(function (el) {
        var question = el.dataset.question;
        var options, answer, explain;
        try { options = JSON.parse(el.dataset.options); } catch (e) { return; }
        try { answer = JSON.parse(el.dataset.answer); } catch (e) { return; }
        explain = el.dataset.explain || '';

        var html = '<div class="challenge-label">&#x1F525; Challenge</div>';
        html += '<div class="challenge-question">' + question + '</div>';
        html += '<div class="challenge-options">';
        for (var i = 0; i < options.length; i++) {
            html += '<button class="challenge-option" data-index="' + i + '">' + options[i] + '</button>';
        }
        html += '</div>';
        html += '<button class="challenge-btn" disabled>Check Answer</button>';
        html += '<div class="challenge-feedback"></div>';
        el.innerHTML = html;

        var optBtns = el.querySelectorAll('.challenge-option');
        var checkBtn = el.querySelector('.challenge-btn');
        var feedback = el.querySelector('.challenge-feedback');
        var selected = -1;

        optBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (this.classList.contains('disabled')) return;
                optBtns.forEach(function (b) { b.classList.remove('selected'); });
                this.classList.add('selected');
                selected = parseInt(this.dataset.index);
                checkBtn.disabled = false;
            });
        });

        checkBtn.addEventListener('click', function () {
            if (selected < 0) return;
            optBtns.forEach(function (b) { b.classList.add('disabled'); });
            checkBtn.disabled = true;

            var isCorrect = selected === answer;
            optBtns[selected].classList.add(isCorrect ? 'correct' : 'wrong');
            if (!isCorrect) optBtns[answer].classList.add('correct');

            feedback.className = 'challenge-feedback show ' + (isCorrect ? 'is-correct' : 'is-wrong');
            feedback.innerHTML = (isCorrect ? '&#x2705; Correct!' : '&#x274C; Not quite.') +
                (explain ? '<span class="explain">' + explain + '</span>' : '');
        });
    });

    // ===== Quiz System =====
    var quizData = {
        html: [
            { q: 'What does HTML stand for?', o: ['HyperText Markup Language', 'HighText Machine Language', 'HyperLinks Markup Language', 'Home Tool Markup Language'], a: 0 },
            { q: 'Which tag is used for the largest heading?', o: ['&lt;h6&gt;', '&lt;head&gt;', '&lt;h1&gt;', '&lt;header&gt;'], a: 2 },
            { q: 'Which attribute specifies the path of an image?', o: ['alt', 'href', 'class', 'src'], a: 3 },
            { q: 'Which element creates a hyperlink?', o: ['&lt;link&gt;', '&lt;a&gt;', '&lt;nav&gt;', '&lt;href&gt;'], a: 1 },
            { q: 'What does &lt;ul&gt; create?', o: ['Ordered list', 'Unordered list', 'Description list', 'Table'], a: 1 },
            { q: 'Which input type creates a checkbox?', o: ['radio', 'text', 'checkbox', 'button'], a: 2 },
            { q: 'Which HTML5 element represents navigation links?', o: ['&lt;nav&gt;', '&lt;menu&gt;', '&lt;header&gt;', '&lt;sidebar&gt;'], a: 0 },
            { q: 'Which attribute opens a link in a new tab?', o: ['new=&quot;tab&quot;', 'target=&quot;_blank&quot;', 'rel=&quot;external&quot;', 'href=&quot;_blank&quot;'], a: 1 },
            { q: 'What is the purpose of the alt attribute on an image?', o: ['Specifies image size', 'Provides alternative text', 'Adds a border', 'Links to another image'], a: 1 },
            { q: 'Which element defines a footer for a document?', o: ['&lt;bottom&gt;', '&lt;footer&gt;', '&lt;section&gt;', '&lt;end&gt;'], a: 1 }
        ],
        css: [
            { q: 'Which CSS property changes the text color?', o: ['font-color', 'text-color', 'color', 'foreground'], a: 2 },
            { q: 'Which selector targets an element by its id?', o: ['.id', '#id', '*id', '&lt;id&gt;'], a: 1 },
            { q: 'What does 1em equal by default?', o: ['1px', 'The current font size', '12pt', '100%'], a: 1 },
            { q: 'Which property creates space inside an element?', o: ['margin', 'padding', 'spacing', 'gap'], a: 1 },
            { q: 'Which value of display enables flexbox?', o: ['block', 'inline', 'flex', 'grid'], a: 2 },
            { q: 'Which property aligns items along the cross axis in flexbox?', o: ['justify-content', 'align-items', 'flex-direction', 'gap'], a: 1 },
            { q: 'Which property defines columns in a CSS Grid?', o: ['grid-columns', 'grid-template-columns', 'column-count', 'grid-gap'], a: 1 },
            { q: 'Which at-rule creates responsive styles based on viewport?', o: ['@viewport', '@responsive', '@media', '@breakpoint'], a: 2 },
            { q: 'Which property adds a shadow behind text?', o: ['box-shadow', 'text-shadow', 'shadow', 'drop-shadow'], a: 1 },
            { q: 'What does box-sizing: border-box do?', o: ['Adds a border around the box', 'Includes padding &amp; border in width', 'Removes the box border', 'Sets box width to auto'], a: 1 }
        ],
        js: [
            { q: 'Which keyword declares a constant variable?', o: ['let', 'var', 'const', 'static'], a: 2 },
            { q: 'What operator returns the remainder after division?', o: ['/', '//', '%', '&amp;'], a: 2 },
            { q: 'Which method adds an element to the end of an array?', o: ['push()', 'pop()', 'shift()', 'unshift()'], a: 0 },
            { q: 'How do you write a single-line comment in JavaScript?', o: ['/* comment */', '# comment', '// comment', '&lt;!-- comment --&gt;'], a: 2 },
            { q: 'Which method selects an element by its ID?', o: ['document.querySelector()', 'document.getElementById()', 'document.getElementByClass()', 'document.select()'], a: 1 },
            { q: 'What does === check?', o: ['Only value equality', 'Only type equality', 'Value and type equality', 'Reference equality'], a: 2 },
            { q: 'Which keyword is used with try to handle errors?', o: ['error', 'finally', 'catch', 'throw'], a: 2 },
            { q: 'What does typeof return for the value true?', o: ['"true"', '"boolean"', '"string"', '"number"'], a: 1 },
            { q: 'Which method creates a new array by transforming each element?', o: ['filter()', 'reduce()', 'map()', 'forEach()'], a: 2 },
            { q: 'Which syntax creates an arrow function?', o: ['function() =>', '() =>', '=> function()', 'arrow()'], a: 1 }
        ]
    };
    var letterLabels = ['A', 'B', 'C', 'D'];

    function renderQuiz(el) {
        var page = el.dataset.page;
        var questions = quizData[page];
        if (!questions) return;

        var storageKey = 'quiz-score-' + page;
        var saved = localStorage.getItem(storageKey);
        var bestScore = saved ? parseInt(saved, 10) : null;
        var submitted = false;

        var idx = 0;
        var selections = [];

        function build() {
            var html = '<div class="quiz-header"><h2>&#x1F9EA; Test Your Knowledge</h2><p>Answer all 10 questions and see your score. Your best score is saved locally.</p></div>';

            if (bestScore !== null) {
                html += '<div class="quiz-score-bar"><div class="quiz-score-item"><span class="score-num">' + bestScore + '/10</span><span class="score-label">Best Score</span></div></div>';
            }

            html += '<div class="quiz-questions">';
            for (var i = 0; i < questions.length; i++) {
                var q = questions[i];
                html += '<div class="quiz-question" data-qidx="' + i + '">';
                html += '<div class="quiz-q-text"><span class="quiz-q-num">' + (i + 1) + '.</span>' + q.q + '</div>';
                html += '<div class="quiz-options">';
                for (var j = 0; j < q.o.length; j++) {
                    var sel = (selections[i] === j) ? ' selected' : '';
                    html += '<div class="quiz-option' + sel + '" data-optidx="' + j + '"><span class="q-letter">' + letterLabels[j] + '.</span><span class="q-radio"></span>' + q.o[j] + '</div>';
                }
                html += '</div></div>';
            }
            html += '</div>';

            html += '<div class="quiz-submit-wrap"><button class="quiz-submit" id="quizSubmit">Submit Answers</button></div>';
            html += '<div class="quiz-result" id="quizResult"></div>';

            el.innerHTML = html;

            var questionEls = el.querySelectorAll('.quiz-question');
            var optionEls = el.querySelectorAll('.quiz-option');
            var submitBtn = document.getElementById('quizSubmit');
            var resultBox = document.getElementById('quizResult');

            optionEls.forEach(function (opt) {
                opt.addEventListener('click', function () {
                    if (submitted) return;
                    var parentQ = this.closest('.quiz-question');
                    var qidx = parseInt(parentQ.dataset.qidx, 10);
                    var optidx = parseInt(this.dataset.optidx, 10);
                    selections[qidx] = optidx;
                    parentQ.querySelectorAll('.quiz-option').forEach(function (o) { o.classList.remove('selected'); });
                    this.classList.add('selected');
                });
            });

            submitBtn.addEventListener('click', function () {
                if (submitted) return;
                var unanswered = false;
                for (var i = 0; i < questions.length; i++) {
                    if (selections[i] === undefined || selections[i] === null) { unanswered = true; break; }
                }
                if (unanswered) {
                    submitBtn.textContent = 'Answer all questions first';
                    submitBtn.disabled = true;
                    setTimeout(function () {
                        submitBtn.textContent = 'Submit Answers';
                        submitBtn.disabled = false;
                    }, 2000);
                    return;
                }
                submitted = true;
                var correct = 0;
                for (var i = 0; i < questions.length; i++) {
                    var qEl = questionEls[i];
                    var chosen = selections[i];
                    var isCorrect = chosen === questions[i].a;
                    if (isCorrect) correct++;
                    qEl.classList.add(isCorrect ? 'correct' : 'wrong');
                    var opts = qEl.querySelectorAll('.quiz-option');
                    opts.forEach(function (o) {
                        o.classList.add('submitted');
                        var oi = parseInt(o.dataset.optidx, 10);
                        if (oi === questions[i].a) o.classList.add('correct');
                        if (oi === chosen && !isCorrect) o.classList.add('wrong');
                    });
                }
                submitBtn.disabled = true;
                submitBtn.textContent = 'Quiz Complete';
                if (bestScore === null || correct > bestScore) {
                    bestScore = correct;
                    localStorage.setItem(storageKey, bestScore);
                }
                var passed = correct >= 7;
                resultBox.className = 'quiz-result show ' + (passed ? 'pass' : 'fail');
                resultBox.innerHTML = '<span class="result-icon">' + (passed ? '&#x1F389;' : '&#x1F4DA;') + '</span>' +
                    '<div class="result-text">' + correct + '/10 — ' + (passed ? 'Great job!' : 'Keep practicing!') + '</div>' +
                    '<div class="result-detail">' + (passed ? 'You have a solid understanding.' : 'Review the sections above and try again.') +
                    (correct === 10 ? ' &#x1F31F; Perfect score!' : '') + '</div>' +
                    '<div class="result-detail">Best score: ' + bestScore + '/10</div>' +
                    '<button class="quiz-retry" id="quizRetry">Retry Quiz</button>';
                document.getElementById('quizRetry').addEventListener('click', function () {
                    submitted = false;
                    selections = [];
                    build();
                });
            });
        }

        build();
    }

    document.querySelectorAll('.quiz').forEach(renderQuiz);

    // ===== Keyboard shortcut: Escape closes nav =====
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
        }
    });

    // ===== Dark/Light Mode Toggle =====
    var themeKey = 'site-theme';
    var savedTheme = localStorage.getItem(themeKey);
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(themeKey, theme);
        var btn = document.getElementById('themeToggle');
        if (btn) btn.textContent = theme === 'dark' ? '\u2600' : '\u263E';
    }

    var initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    var navInner = document.querySelector('.nav-inner');
    if (navInner && !document.getElementById('themeToggle')) {
        var themeBtn = document.createElement('button');
        themeBtn.id = 'themeToggle';
        themeBtn.className = 'theme-toggle';
        themeBtn.setAttribute('aria-label', 'Toggle dark/light mode');
        themeBtn.textContent = initialTheme === 'dark' ? '\u2600' : '\u263E';
        var navMenuEl = document.getElementById('navMenu');
        if (navMenuEl) {
            navInner.insertBefore(themeBtn, navMenuEl);
        } else {
            navInner.appendChild(themeBtn);
        }
        themeBtn.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ===== Site Search =====
    var searchIndex = [
        { page: 'index.html', section: 'basics', title: '1. What is HTML?', desc: 'HTML tags, structure, boilerplate, headings, paragraphs' },
        { page: 'index.html', section: 'text', title: '2. Headings & Paragraphs', desc: 'h1-h6, paragraphs, line breaks, horizontal rules' },
        { page: 'index.html', section: 'links', title: '3. Links & Navigation', desc: 'Anchor tags, href, target, link attributes' },
        { page: 'index.html', section: 'media', title: '4. Images & Media', desc: 'img, src, alt, audio, video, figure, figcaption' },
        { page: 'index.html', section: 'lists', title: '5. Lists', desc: 'Ordered, unordered, description lists, nesting' },
        { page: 'index.html', section: 'tables', title: '6. Tables', desc: 'Table structure, th, td, colspan, rowspan, sortable table' },
        { page: 'index.html', section: 'forms', title: '7. Forms & Inputs', desc: 'Form elements, input types, labels, buttons, validation' },
        { page: 'index.html', section: 'semantic', title: '8. Semantic HTML', desc: 'Semantic elements, header, nav, main, article, section, aside, footer' },
        { page: 'index.html', section: 'interactive', title: '9. Interactive Elements', desc: 'details, summary, dialog, contenteditable' },
        { page: 'index.html', section: 'attributes', title: '10. HTML Attributes', desc: 'Global attributes, id, class, style, data-*, hidden, lang' },
        { page: 'index.html', section: 'entities', title: '11. HTML Entities', desc: 'Character entities, reserved characters, symbols, entity decoder' },
        { page: 'index.html', section: 'flow', title: '12. Block vs Inline', desc: 'Block-level elements, inline elements, display behavior' },
        { page: 'index.html', section: 'iframes', title: '13. Iframes', desc: 'Inline frames, embedding content, sandbox attributes' },
        { page: 'index.html', section: 'meta', title: '14. Meta Tags & SEO', desc: 'Meta tags, viewport, description, SEO, Open Graph' },
        { page: 'index.html', section: 'html5', title: '15. HTML5 Features', desc: 'Semantic elements, multimedia, canvas, local storage, APIs' },
        { page: 'index.html', section: 'quiz', title: '16. HTML Knowledge Quiz', desc: '10-question multiple-choice quiz to test your HTML knowledge' },
        { page: 'index.html', section: 'playground', title: '17. Try It Yourself', desc: 'Interactive HTML playground with live preview' },
        { page: 'css.html', section: 'css-basics', title: '1. What is CSS?', desc: 'CSS syntax, selectors, inline vs internal vs external, cascading' },
        { page: 'css.html', section: 'selectors', title: '2. CSS Selectors', desc: 'Class, ID, element, attribute, pseudo-class, pseudo-element, combinators' },
        { page: 'css.html', section: 'colors', title: '3. Colors & Backgrounds', desc: 'Named colors, hex, rgb, hsl, gradients, multiple backgrounds' },
        { page: 'css.html', section: 'typography', title: '4. Typography', desc: 'Font properties, Google Fonts, text alignment, spacing, decoration' },
        { page: 'css.html', section: 'box-model', title: '5. Box Model', desc: 'Margin, border, padding, content, box-sizing, box-shadow' },
        { page: 'css.html', section: 'display', title: '6. Display & Positioning', desc: 'Block, inline, inline-block, relative, absolute, fixed, sticky' },
        { page: 'css.html', section: 'flexbox', title: '7. Flexbox', desc: 'Flex container, direction, wrap, justify, align, flex shorthand' },
        { page: 'css.html', section: 'grid', title: '8. CSS Grid', desc: 'Grid container, template, gap, areas, auto-fit, minmax' },
        { page: 'css.html', section: 'responsive', title: '9. Responsive Design', desc: 'Media queries, mobile-first, responsive units, clamp' },
        { page: 'css.html', section: 'animations', title: '10. Transitions & Animations', desc: 'Transitions, keyframes, animation properties, timing functions' },
        { page: 'css.html', section: 'pseudo', title: '11. Pseudo-classes & Elements', desc: 'hover, focus, nth-child, before, after, form states' },
        { page: 'css.html', section: 'advanced', title: '12. Advanced CSS', desc: 'Custom properties, filters, blend modes, clip-path, aspect-ratio' },
        { page: 'css.html', section: 'quiz', title: '13. CSS Knowledge Quiz', desc: '10-question multiple-choice quiz to test your CSS knowledge' },
        { page: 'css.html', section: 'css-playground', title: '14. CSS Playground', desc: 'Interactive CSS playground with live preview' },
        { page: 'javascript.html', section: 'js-basics', title: '1. What is JavaScript?', desc: 'JS introduction, script tag, console.log, statements' },
        { page: 'javascript.html', section: 'variables', title: '2. Variables & Data Types', desc: 'let, const, var, strings, numbers, booleans, typeof, null, undefined' },
        { page: 'javascript.html', section: 'operators', title: '3. Operators', desc: 'Arithmetic, comparison, logical, string, assignment operators' },
        { page: 'javascript.html', section: 'functions', title: '4. Functions', desc: 'Function declarations, parameters, return values, arrow functions' },
        { page: 'javascript.html', section: 'conditionals', title: '5. Conditionals', desc: 'if, else if, else, switch, ternary operator' },
        { page: 'javascript.html', section: 'loops', title: '6. Loops', desc: 'for, while, do-while, forEach, break, continue' },
        { page: 'javascript.html', section: 'arrays', title: '7. Arrays', desc: 'Array methods, push, pop, map, filter, reduce, spread' },
        { page: 'javascript.html', section: 'objects', title: '8. Objects', desc: 'Object literals, properties, methods, destructuring, Object.keys' },
        { page: 'javascript.html', section: 'dom', title: '9. DOM Manipulation', desc: 'Selecting elements, changing content, styles, creating elements' },
        { page: 'javascript.html', section: 'events', title: '10. Events', desc: 'Event listeners, click, input, form submit, event object' },
        { page: 'javascript.html', section: 'es6', title: '11. ES6+ Features', desc: 'Template literals, destructuring, spread, rest, optional chaining' },
        { page: 'javascript.html', section: 'async', title: '12. Async JavaScript', desc: 'Callbacks, promises, async/await, setTimeout, setInterval' },
        { page: 'javascript.html', section: 'quiz', title: '13. JS Knowledge Quiz', desc: '10-question multiple-choice quiz to test your JavaScript knowledge' },
        { page: 'javascript.html', section: 'js-playground', title: '14. JS Playground', desc: 'Interactive JavaScript playground with console output' },
        { page: 'about.html', section: 'bio', title: 'About Me', desc: 'Timcwat Mallam bio, background, passion for teaching' },
        { page: 'about.html', section: 'skills', title: 'Skills & Tools', desc: 'HTML5, CSS3, JavaScript, React, Git, Responsive design' },
        { page: 'about.html', section: 'projects', title: 'Projects', desc: 'Web Dev Playground, JS Playground, CSS Playground' },
        { page: 'timmy.html', section: 'intro', title: 'About the Project', desc: 'Why this project exists, learning philosophy' },
        { page: 'contact.html', section: '', title: 'Contact', desc: 'Get in touch via contact form' },
        { page: 'tools.html', section: 'gradient', title: 'Gradient Generator', desc: 'Interactive CSS gradient tool with live preview' },
        { page: 'tools.html', section: 'palette', title: 'Color Palette Builder', desc: 'Generate harmonious color schemes from a base color' },
        { page: 'tools.html', section: 'shadow', title: 'Box Shadow Builder', desc: 'Interactive box-shadow tool with sliders and live preview' },
        { page: 'tools.html', section: 'filter', title: 'CSS Filter Playground', desc: 'Apply brightness, contrast, blur, hue, sepia and more' },
        { page: 'privacy.html', section: 'info', title: 'Privacy Policy', desc: 'Information collection, privacy practices' },
        { page: 'accessibility.html', section: 'what', title: 'What is A11y?', desc: 'Web accessibility overview, a11y meaning, disability statistics' },
        { page: 'accessibility.html', section: 'semantic', title: 'Semantic HTML for A11y', desc: 'Landmarks, headings, semantic elements for screen readers' },
        { page: 'accessibility.html', section: 'aria', title: 'ARIA', desc: 'ARIA roles, properties, states, when to use and when to avoid' },
        { page: 'accessibility.html', section: 'keyboard', title: 'Keyboard Navigation', desc: 'Tabindex, focus indicators, keyboard event handling' },
        { page: 'accessibility.html', section: 'contrast', title: 'Color & Contrast', desc: 'WCAG contrast ratios, color blindness, contrast checker tool' },
        { page: 'accessibility.html', section: 'screen', title: 'Screen Readers', desc: 'How screen readers work, ARIA live regions, alt text' },
        { page: 'accessibility.html', section: 'forms', title: 'Accessible Forms', desc: 'Labels, error messages, required fields, ARIA form hints' },
        { page: 'accessibility.html', section: 'focus', title: 'Focus Management', desc: 'Skip links, focus trapping, focus visible styles' },
        { page: 'accessibility.html', section: 'testing', title: 'Testing Tools & Checklist', desc: 'WAVE, axe DevTools, Lighthouse, keyboard testing, checklist' }
    ];

    function injectSearchUI() {
        if (document.getElementById('searchOverlay')) return;
        var btn = document.createElement('button');
        btn.id = 'searchTrigger';
        btn.setAttribute('aria-label', 'Search tutorials');
        btn.textContent = '\u{1F50D}';
        var navMenuEl = document.getElementById('navMenu');
        var themeBtn = document.getElementById('themeToggle');
        if (themeBtn && themeBtn.parentNode) {
            themeBtn.parentNode.insertBefore(btn, themeBtn);
        } else if (navInner) {
            navInner.appendChild(btn);
        }

        var overlay = document.createElement('div');
        overlay.id = 'searchOverlay';
        overlay.innerHTML = '<div id="searchBox"><input id="searchInput" type="text" placeholder="Search tutorials..." autocomplete="off"><div id="searchResults"></div></div><button id="searchClose" aria-label="Close search">&times;</button>';
        document.body.appendChild(overlay);

        var input = document.getElementById('searchInput');
        var results = document.getElementById('searchResults');
        var close = document.getElementById('searchClose');

        btn.addEventListener('click', function () {
            overlay.classList.add('open');
            setTimeout(function () { input.focus(); }, 100);
        });
        close.addEventListener('click', function () { overlay.classList.remove('open'); });
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) overlay.classList.remove('open');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('open')) overlay.classList.remove('open');
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                overlay.classList.toggle('open');
                if (overlay.classList.contains('open')) setTimeout(function () { input.focus(); }, 100);
            }
        });

        input.addEventListener('input', function () {
            var q = input.value.trim().toLowerCase();
            if (!q) { results.innerHTML = '<div class="search-empty">Type to search across all tutorials</div>'; return; }
            var matches = searchIndex.filter(function (item) {
                return item.title.toLowerCase().indexOf(q) !== -1 ||
                       item.desc.toLowerCase().indexOf(q) !== -1 ||
                       item.section.toLowerCase().indexOf(q) !== -1;
            });
            if (matches.length === 0) {
                results.innerHTML = '<div class="search-empty">No results found for "' + input.value + '"</div>';
                return;
            }
            var html = '';
            matches.slice(0, 12).forEach(function (m) {
                var pageLabel = m.page === 'index.html' ? 'HTML Tutorial' : m.page === 'css.html' ? 'CSS Tutorial' : m.page === 'javascript.html' ? 'JS Tutorial' : m.page.replace('.html', '').replace(/-/g, ' ');
                var href = m.section ? m.page + '#' + m.section : m.page;
                html += '<a href="' + href + '" class="search-result" onclick="document.getElementById(\'searchOverlay\').classList.remove(\'open\')">' +
                    '<div class="search-result-title">' + m.title + '</div>' +
                    '<div class="search-result-desc">' + m.desc + '</div>' +
                    '<div class="search-result-page">' + pageLabel + '</div></a>';
            });
            results.innerHTML = html;
        });
    }

    injectSearchUI();

    // ===== GDPR/CCPA Consent Banner =====
    var consentKey = 'cookie-consent';
    var consent = localStorage.getItem(consentKey);

    function loadAdSense() {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5862355594319303';
        s.crossOrigin = 'anonymous';
        document.head.appendChild(s);
    }

    function setConsent(value) {
        localStorage.setItem(consentKey, value);
        var banner = document.getElementById('consent-banner');
        if (banner) banner.classList.remove('show');
        if (value === 'accepted') loadAdSense();
    }

    if (!consent) {
        var banner = document.createElement('div');
        banner.id = 'consent-banner';
        banner.innerHTML = '<div class="consent-content">' +
            '<div class="consent-text">We use cookies from Google AdSense to personalize ads. By clicking "Accept All", you consent to our use of cookies. <a href="privacy.html">Learn more</a></div>' +
            '<div class="consent-actions">' +
            '<button class="btn-reject" id="consent-reject">Reject All</button>' +
            '<button class="btn-accept" id="consent-accept">Accept All</button>' +
            '</div></div>';
        document.body.appendChild(banner);
        requestAnimationFrame(function () { banner.classList.add('show'); });

        document.getElementById('consent-accept').addEventListener('click', function () { setConsent('accepted'); });
        document.getElementById('consent-reject').addEventListener('click', function () { setConsent('rejected'); });
    } else if (consent === 'accepted') {
        loadAdSense();
    }

    // ===== Share Button =====
    if (!document.getElementById('shareBtn')) {
        var shareBtn = document.createElement('button');
        shareBtn.id = 'shareBtn';
        shareBtn.setAttribute('aria-label', 'Share this page');
        shareBtn.textContent = '\u2197';
        document.body.appendChild(shareBtn);

        var sharePopup = document.createElement('div');
        sharePopup.id = 'sharePopup';
        sharePopup.innerHTML =
            '<div class="share-label">Share via</div>' +
            '<button class="share-link" data-share="whatsapp"><span class="share-icon whatsapp">&#x1F4AC;</span> WhatsApp</button>' +
            '<button class="share-link" data-share="facebook"><span class="share-icon facebook">f</span> Facebook</button>' +
            '<button class="share-link" data-share="twitter"><span class="share-icon twitter">&#x1D54F;</span> X (Twitter)</button>' +
            '<button class="share-link" data-share="copy"><span class="share-icon copy">&#x1F4CB;</span> Copy Link</button>';
        document.body.appendChild(sharePopup);

        var popupOpen = false;

        function getShareUrl() { return window.location.href; }
        function getShareText() {
            var title = document.title || 'Web Dev Playground';
            return title + ' - Learn web development with interactive tutorials';
        }

        function doShare(platform) {
            var url = encodeURIComponent(getShareUrl());
            var text = encodeURIComponent(getShareText());
            var link;
            switch (platform) {
                case 'whatsapp':
                    link = 'https://wa.me/?text=' + text + '%20' + url;
                    break;
                case 'facebook':
                    link = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
                    break;
                case 'twitter':
                    link = 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url;
                    break;
                case 'copy':
                    navigator.clipboard.writeText(getShareUrl()).then(function () {
                        sharePopup.classList.remove('open');
                        popupOpen = false;
                        shareBtn.textContent = '\u2713';
                        setTimeout(function () { shareBtn.textContent = '\u2197'; }, 2000);
                    });
                    return;
            }
            if (link) window.open(link, '_blank', 'width=600,height=500');
            sharePopup.classList.remove('open');
            popupOpen = false;
        }

        shareBtn.addEventListener('click', function () {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: getShareText(),
                    url: getShareUrl()
                }).catch(function () {});
            } else {
                popupOpen = !popupOpen;
                sharePopup.classList.toggle('open', popupOpen);
            }
        });

        sharePopup.querySelectorAll('.share-link').forEach(function (el) {
            el.addEventListener('click', function () {
                doShare(this.dataset.share);
            });
        });

        document.addEventListener('click', function (e) {
            if (popupOpen && !shareBtn.contains(e.target) && !sharePopup.contains(e.target)) {
                sharePopup.classList.remove('open');
                popupOpen = false;
            }
        });
    }

    // ===== Install Prompt =====
    var deferredPrompt = null;
    var installBanner = document.createElement('div');
    installBanner.id = 'installBanner';
    installBanner.innerHTML = '<div class="install-content"><span>Install this app for quick access</span><button id="installBtn" class="install-btn">Install</button><button id="installDismiss" class="install-dismiss">&times;</button></div>';
    installBanner.style.display = 'none';
    document.body.appendChild(installBanner);

    var shareBtnEl = document.getElementById('shareBtn');

    function hideInstallBanner() {
        installBanner.classList.remove('show');
        if (shareBtnEl) shareBtnEl.style.display = 'flex';
        setTimeout(function () { installBanner.style.display = 'none'; }, 300);
    }

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        installBanner.style.display = 'block';
        if (shareBtnEl) shareBtnEl.style.display = 'none';
        requestAnimationFrame(function () { installBanner.classList.add('show'); });
    });

    document.getElementById('installBtn').addEventListener('click', function () {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
            deferredPrompt = null;
            hideInstallBanner();
        });
    });

    document.getElementById('installDismiss').addEventListener('click', function () {
        hideInstallBanner();
        deferredPrompt = null;
    });
});