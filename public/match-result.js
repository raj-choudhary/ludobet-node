/**
 * Match Result & Screenshot Submission Controller
 * Ludo Tournament King
 */

let selectedOutcome = 'won'; // 'won' | 'lost' | 'cancel'
let attachedFile = null;

// 1. Select Outcome Card
function selectOutcome(outcome) {
  selectedOutcome = outcome;

  // Update card UI classes
  const cards = ['won', 'lost', 'cancel'];
  cards.forEach(card => {
    const el = document.getElementById(`card-${card}`);
    if (el) {
      if (card === outcome) {
        el.classList.add('selected');
        el.querySelector('.outcome-radio-circle').innerText = '✓';
      } else {
        el.classList.remove('selected');
        el.querySelector('.outcome-radio-circle').innerText = '';
      }
    }
  });

  const screenshotSection = document.getElementById('screenshot-section');
  const disputeSection = document.getElementById('dispute-reason-section');
  const submitBtn = document.getElementById('btn-submit-result');

  if (outcome === 'won') {
    if (screenshotSection) screenshotSection.style.display = 'flex';
    if (disputeSection) disputeSection.style.display = 'none';
    if (submitBtn) submitBtn.innerHTML = '<span>🚀 SUBMIT RESULT FOR VERIFICATION (+₹95.00)</span>';
  } else if (outcome === 'lost') {
    if (screenshotSection) screenshotSection.style.display = 'none';
    if (disputeSection) disputeSection.style.display = 'none';
    if (submitBtn) submitBtn.innerHTML = '<span>❌ CONCEDE DEFEAT (CONFIRM LOSS)</span>';
  } else if (outcome === 'cancel') {
    if (screenshotSection) screenshotSection.style.display = 'flex';
    if (disputeSection) disputeSection.style.display = 'flex';
    if (submitBtn) submitBtn.innerHTML = '<span>⚠️ SUBMIT DISPUTE / REFUND REQUEST</span>';
  }
}

// 2. File Input & Image Preview
function triggerFileInput() {
  const input = document.getElementById('screenshot-file-input');
  if (input) input.click();
}

function handleFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  attachedFile = file;

  const reader = new FileReader();
  reader.onload = function(e) {
    const previewImg = document.getElementById('preview-img');
    const dropzoneEmpty = document.getElementById('dropzone-empty');
    const dropzonePreview = document.getElementById('dropzone-preview');

    if (previewImg) previewImg.src = e.target.result;
    if (dropzoneEmpty) dropzoneEmpty.style.display = 'none';
    if (dropzonePreview) dropzonePreview.style.display = 'flex';

    showToast('Screenshot attached successfully!', '📸');
  };
  reader.readAsDataURL(file);
}

// 3. Sample Guide Modal / Toast
function showSampleGuide() {
  showToast('Example: A clear screen showing "YOU WIN" with the score in Ludo King.', '💡');
}

// 4. Submit Result Handler
function submitMatchResult() {
  if (selectedOutcome === 'won' && !attachedFile) {
    // For prototype demo, attach sample victory if user didn't pick file
    const previewImg = document.getElementById('preview-img');
    if (!previewImg || !previewImg.src || previewImg.src.endsWith('.html')) {
      showToast('Please attach your Winning Screenshot first!', '⚠️');
      triggerFileInput();
      return;
    }
  }

  const modal = document.getElementById('victory-modal');
  const subMsg = document.getElementById('victory-sub-msg');

  if (selectedOutcome === 'won') {
    if (subMsg) subMsg.innerText = 'Your victory screenshot is verified. ₹95.00 has been added to your Winnings Wallet!';
    if (modal) modal.classList.add('show');
  } else if (selectedOutcome === 'lost') {
    showToast('Match loss confirmed. Better luck in the next battle!', '❌');
    setTimeout(() => {
      window.location.href = 'ludo-classic.html';
    }, 1500);
  } else if (selectedOutcome === 'cancel') {
    const disputeModal = document.getElementById('dispute-modal');
    if (disputeModal) disputeModal.classList.add('show');
    showToast('Dispute ticket raised! SLA: 15 Mins.', '⚠️');
  }
}

// 5. Toast Utility
function showToast(msg, icon = '⚡') {
  const toast = document.getElementById('app-toast');
  const msgEl = document.getElementById('toast-msg');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !msgEl) return;

  msgEl.innerText = msg;
  if (iconEl) iconEl.innerText = icon;

  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}
