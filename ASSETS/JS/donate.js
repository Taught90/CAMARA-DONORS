document.addEventListener('DOMContentLoaded', function() {

    // ========== IMPACT CALCULATOR ==========
    const calculator = {
        elements: {
            amountBtns: document.querySelectorAll('.amount-btn'),
            customAmount: document.getElementById('donationAmount'),
            frequencyBtns: document.querySelectorAll('.frequency-btn'),
            calculateBtn: document.querySelector('.calculate-impact-btn'),
            impactDisplay: document.getElementById('studentsImpacted'),
            finalAmount: document.getElementById('finalAmount'),
            impactVisual: document.getElementById('impactVisual')
        },
        values: {
            selectedAmount: 100,
            isMonthly: false,
            impactRatio: 50 // $50 per student per year
        },
        init() {
            this.setupAmountButtons();
            this.setupFrequencyButtons();
            this.setupCalculateButton();
            this.setupCustomAmountInput();
        },
        setupAmountButtons() {
            this.elements.amountBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.elements.amountBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.values.selectedAmount = parseInt(btn.dataset.amount);
                    this.elements.customAmount.value = this.values.selectedAmount;
                });
            });
        },
        setupCustomAmountInput() {
            this.elements.customAmount.addEventListener('input', () => {
                const value = parseInt(this.elements.customAmount.value) || 0;
                if (value > 0) {
                    this.values.selectedAmount = value;
                    this.elements.amountBtns.forEach(btn => btn.classList.remove('active'));
                }
            });
        },
        setupFrequencyButtons() {
            this.elements.frequencyBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.elements.frequencyBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.values.isMonthly = btn.dataset.frequency === 'monthly';
                });
            });
        },
        setupCalculateButton() {
            this.elements.calculateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.values.selectedAmount > 0) {
                    this.calculateImpact();
                    this.animateImpact();
                } else {
                    this.showError("Please enter a valid donation amount");
                }
            });
        },
        calculateImpact() {
            const students = Math.floor(this.values.selectedAmount / this.values.impactRatio);
            this.elements.impactDisplay.textContent = students;
            this.elements.finalAmount.value = this.values.selectedAmount;
            
            // Update frequency in form
            document.querySelector(`input[name="frequency"][value="${this.values.isMonthly ? 'monthly' : 'one-time'}"]`).checked = true;
        },
        animateImpact() {
            const visual = this.elements.impactVisual;
            visual.style.transform = 'scale(1.05)';
            visual.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                visual.style.transform = 'scale(1)';
                
                // Add celebration effect
                const confetti = document.createElement('div');
                confetti.className = 'impact-confetti';
                visual.appendChild(confetti);
                
                setTimeout(() => {
                    visual.removeChild(confetti);
                }, 1000);
            }, 300);
        },
        showError(message) {
            const errorEl = document.createElement('div');
            errorEl.className = 'calculator-error';
            errorEl.textContent = message;
            
            const controls = document.querySelector('.calculator-controls');
            const existingError = controls.querySelector('.calculator-error');
            if (existingError) controls.removeChild(existingError);
            
            controls.insertBefore(errorEl, this.elements.calculateBtn);
            
            setTimeout(() => {
                errorEl.style.opacity = '0';
                setTimeout(() => {
                    if (errorEl.parentNode) controls.removeChild(errorEl);
                }, 300);
            }, 3000);
        }
    };

    calculator.init();

    // ========== PAYMENT METHOD TABS ==========
    const paymentTabs = {
        elements: {
            tabs: document.querySelectorAll('.payment-tab'),
            contents: document.querySelectorAll('.payment-content')
        },
        init() {
            this.elements.tabs.forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab));
            });
        },
        switchTab(selectedTab) {
            const tabId = selectedTab.dataset.tab;
            
            // Update active tab
            this.elements.tabs.forEach(tab => tab.classList.remove('active'));
            selectedTab.classList.add('active');
            
            // Update active content
            this.elements.contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}Content`) {
                    content.classList.add('active');
                }
            });
        }
    };

    paymentTabs.init();

    // ========== FAQ ACCORDION ==========
    const faqAccordion = {
        elements: {
            questions: document.querySelectorAll('.faq-question'),
            items: document.querySelectorAll('.faq-item')
        },
        init() {
            this.elements.questions.forEach((question, index) => {
                question.addEventListener('click', () => this.toggleItem(index));
            });
        },
        toggleItem(index) {
            const item = this.elements.items[index];
            const isActive = item.classList.contains('active');
            
            // Close all items first
            this.elements.items.forEach(i => {
                i.classList.remove('active');
                const answer = i.querySelector('.faq-answer');
                answer.style.maxHeight = '0';
                i.querySelector('.toggle-icon').textContent = '+';
            });
            
            // Open selected if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = `${answer.scrollHeight}px`;
                item.querySelector('.toggle-icon').textContent = '-';
            }
        }
    };

    faqAccordion.init();

    // ========== FORM VALIDATION ==========
    const donationForm = document.getElementById('donationForm');
    
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const name = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const amount = document.getElementById('finalAmount').value.trim();
            const paymentMethod = document.querySelector('.payment-tab.active').dataset.tab;
            
            if (!name || !email || !amount) {
                showFormError('Please fill in all required fields');
                return;
            }
            
            if (paymentMethod === 'mpesa' && !document.getElementById('mpesaNumber').value.trim()) {
                showFormError('Please enter your M-Pesa number');
                return;
            }
            
            if (paymentMethod === 'card') {
                const cardNumber = document.getElementById('cardNumber').value.trim();
                const expiry = document.getElementById('expiry').value.trim();
                const cvv = document.getElementById('cvv').value.trim();
                const cardName = document.getElementById('cardName').value.trim();
                
                if (!cardNumber || !expiry || !cvv || !cardName) {
                    showFormError('Please fill in all card details');
                    return;
                }
            }
            
            // If validation passes
            processDonation();
        });
    }
    
    function showFormError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.textContent = message;
        
        const existingError = donationForm.querySelector('.form-error');
        if (existingError) donationForm.removeChild(existingError);
        
        donationForm.insertBefore(errorEl, donationForm.querySelector('.submit-donation-btn'));
        
        setTimeout(() => {
            errorEl.style.opacity = '0';
            setTimeout(() => {
                if (errorEl.parentNode) donationForm.removeChild(errorEl);
            }, 300);
        }, 3000);
    }
    
    function processDonation() {
        // Show loading state
        const submitBtn = document.querySelector('.submit-donation-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'donation-success';
            successMsg.innerHTML = `
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#4CAF50">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Thank You for Your Donation!</h3>
                <p>Your contribution will help transform education through technology.</p>
                <p>A receipt has been sent to your email.</p>
            `;
            
            donationForm.style.display = 'none';
            document.querySelector('.form-container').appendChild(successMsg);
            
            // Reset form (for demo purposes)
            setTimeout(() => {
                successMsg.style.opacity = '0';
                setTimeout(() => {
                    document.querySelector('.form-container').removeChild(successMsg);
                    donationForm.style.display = 'block';
                    donationForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Reset calculator
                    calculator.values.selectedAmount = 100;
                    calculator.elements.customAmount.value = '';
                    calculator.elements.amountBtns[2].click(); // Select $100 by default
                    calculator.elements.frequencyBtns[0].click(); // Select one-time
                    calculator.elements.impactDisplay.textContent = '0';
                }, 500);
            }, 5000);
        }, 1500);
    }

    // ========== DEDICATION TOGGLE ==========
    const dedicationToggle = document.querySelector('.toggle-dedication');
    if (dedicationToggle) {
        dedicationToggle.addEventListener('change', function() {
            const dedicationFields = document.querySelector('.dedication-fields');
            if (this.checked) {
                dedicationFields.style.display = 'block';
                setTimeout(() => {
                    dedicationFields.style.opacity = '1';
                    dedicationFields.style.maxHeight = '300px';
                }, 10);
            } else {
                dedicationFields.style.opacity = '0';
                dedicationFields.style.maxHeight = '0';
                setTimeout(() => {
                    dedicationFields.style.display = 'none';
                }, 300);
            }
        });
    }
});