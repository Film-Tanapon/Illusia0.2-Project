document.addEventListener('DOMContentLoaded', function() {
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');
    const defaultsBtn = document.getElementById('defaults-btn');
    const textSpeed = localStorage.getItem('textSpeed') || 5;
    const textSize = localStorage.getItem('textSize') || 'medium';
    const musicVolume = localStorage.getItem('musicVolume') || 70;
    const voiceVolume = localStorage.getItem('voiceVolume') || 80;
    const sfxVolume = localStorage.getItem('sfxVolume') || 60;

    document.getElementById('text-speed').value = textSpeed;
    document.getElementById('text-speed-value').textContent = textSpeed;
    document.getElementById('text-size').value = textSize;
    document.getElementById('music-volume').value = musicVolume;
    document.getElementById('music-volume-value').textContent = musicVolume + '%';
    document.getElementById('voice-volume').value = voiceVolume;
    document.getElementById('voice-volume-value').textContent = voiceVolume + '%';
    document.getElementById('sfx-volume').value = sfxVolume;
    document.getElementById('sfx-volume-value').textContent = sfxVolume + '%';

    function closeSettings() { window.history.back(); }
    cancelBtn.addEventListener('click', closeSettings);

    function updateTextPreview() {
        const size = document.getElementById('text-size').value;
        const preview = document.getElementById('text-preview');
        preview.style.fontSize = size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px';
    }

    function updateTextDemo() {
        const speed = parseInt(document.getElementById('text-speed').value);
        const demo = document.getElementById('text-demo');
        let speedLabel;

        switch(speed){
            case 1: speedLabel = "Slow"; break;
            case 2: speedLabel = "Medium"; break;
            case 3: speedLabel = "Fast"; break;
            default: speedLabel = "Medium";
    }

        demo.textContent = speedLabel + " text speed...";
        document.getElementById('text-speed-value').textContent = speedLabel;
    }

    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        const valueDisplay = document.getElementById(slider.id + '-value');
        if (valueDisplay) {
            valueDisplay.textContent = slider.id.includes('volume') ? slider.value + '%' : slider.value;
            slider.addEventListener('input', function() {
                valueDisplay.textContent = slider.id.includes('volume') ? this.value + '%' : this.value;
                if (slider.id === 'text-speed') updateTextDemo();
            });
        }
    });

    document.getElementById('text-size').addEventListener('change', updateTextPreview);

    saveBtn.addEventListener('click', function() {
        localStorage.setItem('textSpeed', document.getElementById('text-speed').value);
        localStorage.setItem('textSize', document.getElementById('text-size').value);
        localStorage.setItem('musicVolume', document.getElementById('music-volume').value);
        localStorage.setItem('voiceVolume', document.getElementById('voice-volume').value);
        localStorage.setItem('sfxVolume', document.getElementById('sfx-volume').value);
        alert('Settings saved successfully!');
        closeSettings();
    });

    defaultsBtn.addEventListener('click', function() {
        document.getElementById('text-speed').value = 5;
        document.getElementById('text-speed-value').textContent = '5';
        document.getElementById('text-size').value = 'medium';
        document.getElementById('music-volume').value = 70;
        document.getElementById('music-volume-value').textContent = '70%';
        document.getElementById('voice-volume').value = 80;
        document.getElementById('voice-volume-value').textContent = '80%';
        document.getElementById('sfx-volume').value = 60;
        document.getElementById('sfx-volume-value').textContent = '60%';
        updateTextPreview();
        updateTextDemo();
        alert('Default settings restored!');
    });

    document.getElementById('text-speed').addEventListener('input', updateTextDemo);
    updateTextPreview();
    updateTextDemo();
});
