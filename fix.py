import codecs
content = codecs.open('frontend/index.html', 'r', 'utf-16le').read()
content = content.replace("document.getElementById('forgotBtn')?.onclick=()=>openModal('forgotModal');", "let forgotBtn = document.getElementById('forgotBtn'); if(forgotBtn) forgotBtn.onclick=()=>openModal('forgotModal');")
codecs.open('frontend/index.html', 'w', 'utf-16le').write(content)
