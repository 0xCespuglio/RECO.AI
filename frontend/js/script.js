document.addEventListener('DOMContentLoaded', () => {
	const startBtn = document.querySelector('.btn-start');
	if (startBtn) {
		startBtn.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = 'preferenze/preferenze.html';
		});
	}

	console.log('RECO.AI - Home page caricata');
});
