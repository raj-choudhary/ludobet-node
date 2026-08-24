/**
 * LUDO BET - ENTERPRISE SUPER ADMIN & RBAC CONTROLLER
 * Full Role-Based Architecture, SVG Charts, Live Data Stores & Audit Logger
 */

(function () {
  'use strict';

  // --- 1. Synthesized Audio Feedback ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function playAdminSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'warn') {
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  }

  function showToast(msg, icon = 'ℹ️') {
    let toast = document.getElementById('admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-toast';
      toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:#0f172a; color:#fff; padding:12px 18px; border-radius:12px; font-size:12px; font-weight:800; display:flex; align-items:center; gap:8px; z-index:9999; box-shadow:0 10px 25px rgba(0,0,0,0.3); border:1px solid #334155; transition:all 0.2s; opacity:0; transform:translateY(10px); pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="font-size:16px;">${icon}</span> <span>${msg}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2800);
  }

  // --- 2. Master State & RBAC Permissions Matrix ---
  const STATE = {
    currentRole: 'super_admin', // 'super_admin' | 'support' | 'kyc' | 'finance' | 'dispute' | 'game' | 'marketing' | 'security'
    currentTab: 'dashboard',
    isMaintenance: false,
    selectedPlayerId: null,
    pendingAction: null, // Used for sensitive audit confirmation modal
    
    // Core Data Stores
    players: [
      { id: 'LD10458', name: 'Rajendra Kumar', phone: '+91 9876543221', joined: '08 Aug 2026', kyc: 'approved', deposit: 400, winnings: 750, bonus: 100, status: 'active', battles: 126, wins: 78, winRate: '61.9%', ip: '103.21.44.12', deviceId: 'DEV-84920' },
      { id: 'LD20541', name: 'Rahul Sharma', phone: '+91 9811223344', joined: '10 Aug 2026', kyc: 'approved', deposit: 250, winnings: 120, bonus: 50, status: 'active', battles: 45, wins: 28, winRate: '62.2%', ip: '103.54.12.88', deviceId: 'DEV-19402' },
      { id: 'LD30912', name: 'Amit Verma', phone: '+91 9722334455', joined: '12 Aug 2026', kyc: 'pending', deposit: 100, winnings: 0, bonus: 100, status: 'active', battles: 12, wins: 4, winRate: '33.3%', ip: '115.98.23.11', deviceId: 'DEV-77382' },
      { id: 'LD40192', name: 'Vikash Yadav', phone: '+91 9633445566', joined: '14 Aug 2026', kyc: 'rejected', deposit: 50, winnings: 0, bonus: 20, status: 'active', battles: 8, wins: 2, winRate: '25.0%', ip: '49.36.120.4', deviceId: 'DEV-99201' },
      { id: 'LD50831', name: 'Rohan Cheater', phone: '+91 9544556677', joined: '15 Aug 2026', kyc: 'rejected', deposit: 0, winnings: 0, bonus: 0, status: 'banned', battles: 4, wins: 0, winRate: '0.0%', ip: '49.36.120.4', deviceId: 'DEV-99201' },
      { id: 'LD60219', name: 'Neha Singh', phone: '+91 9455667788', joined: '16 Aug 2026', kyc: 'approved', deposit: 800, winnings: 1450, bonus: 150, status: 'active', battles: 92, wins: 59, winRate: '64.1%', ip: '103.22.88.9', deviceId: 'DEV-34102' }
    ],

    deposits: [
      { id: 'TXN-DEP-84910', playerId: 'LD10458', name: 'Rajendra Kumar', amount: 500, method: 'Google Pay UPI', utr: 'ICICI48291084', status: 'approved', time: '18 Aug 2026, 14:22' },
      { id: 'TXN-DEP-84911', playerId: 'LD20541', name: 'Rahul Sharma', amount: 200, method: 'PhonePe UPI', utr: 'AXIS98204821', status: 'approved', time: '18 Aug 2026, 13:45' },
      { id: 'TXN-DEP-84912', playerId: 'LD30912', name: 'Amit Verma', amount: 100, method: 'Manual QR Scan', utr: 'HDFC10492810', status: 'pending', time: '18 Aug 2026, 13:10' },
      { id: 'TXN-DEP-84913', playerId: 'LD40192', name: 'Vikash Yadav', amount: 1000, method: 'Paytm UPI', utr: 'PAYTM839201', status: 'failed', time: '18 Aug 2026, 11:30' }
    ],

    withdrawals: [
      { id: 'WDR-94021', playerId: 'LD10458', name: 'Rajendra Kumar', amount: 1000, tds: 300, net: 700, payout: 'rajendra@okaxis', kyc: 'approved', status: 'pending', time: '18 Aug 2026, 14:30' },
      { id: 'WDR-94022', playerId: 'LD60219', name: 'Neha Singh', amount: 500, tds: 150, net: 350, payout: 'HDFC •••• 4421', kyc: 'approved', status: 'pending', time: '18 Aug 2026, 13:50' },
      { id: 'WDR-94020', playerId: 'LD20541', name: 'Rahul Sharma', amount: 300, tds: 90, net: 210, payout: 'rahul@upi', kyc: 'approved', status: 'approved', utr: 'SBI-UTR-948201', time: '18 Aug 2026, 10:15' }
    ],

    kycQueue: [
      { playerId: 'LD30912', name: 'Amit Verma', docType: 'Aadhaar Card', docNum: 'XXXX-XXXX-8921', status: 'pending', time: '18 Aug 2026, 12:40' },
      { playerId: 'LD40192', name: 'Vikash Yadav', docType: 'PAN Card', docNum: 'ABCDE8492F', status: 'pending', time: '18 Aug 2026, 11:20' }
    ],

    kycHistory: [
      { id: 'KYC-VER-89421', playerId: 'LD10458', name: 'Rajendra Kumar', docType: 'Aadhaar Card', docNum: 'XXXX-XXXX-8921', verdict: 'approved', admin: 'Kavita Singh', role: 'KYC Exec', reason: 'Govt UID matched & clear scan verified', time: '18 Aug 2026, 14:15', ip: '192.168.1.10' },
      { id: 'KYC-VER-89420', playerId: 'LD20541', name: 'Rahul Sharma', docType: 'PAN Card', docNum: 'ABCPS8492K', verdict: 'approved', admin: 'Vikram Malhotra', role: 'Super Admin', reason: 'High-res original document approved', time: '18 Aug 2026, 12:30', ip: '192.168.1.1' },
      { id: 'KYC-VER-89419', playerId: 'LD40192', name: 'Vikash Yadav', docType: 'Aadhaar Card', docNum: 'XXXX-XXXX-3341', verdict: 'rejected', admin: 'Kavita Singh', role: 'KYC Exec', reason: 'Blurry photo & address portion cropped', time: '18 Aug 2026, 11:20', ip: '192.168.1.10' },
      { id: 'KYC-VER-89418', playerId: 'LD50831', name: 'Rohan Cheater', docType: 'PAN Card', docNum: 'XYZ999999', verdict: 'rejected', admin: 'Kavita Singh', role: 'KYC Exec', reason: 'Tampered digital document detected', time: '17 Aug 2026, 16:40', ip: '192.168.1.10' },
      { id: 'KYC-VER-89417', playerId: 'LD60219', name: 'Neha Singh', docType: 'Aadhaar Card', docNum: 'XXXX-XXXX-7712', verdict: 'approved', admin: 'Vikram Malhotra', role: 'Super Admin', reason: 'Govt UID database AI match 100%', time: '17 Aug 2026, 14:05', ip: '192.168.1.1' }
    ],

    disputes: [
      { id: 'DISP-89421', battleId: 'BTL-94821', game: 'Ludo Classic', playerA: 'Rajendra (LD10458)', playerB: 'Amit (LD30912)', entry: 50, prize: 95, claimA: 'I Won with 4 tokens home', claimB: 'Opponent disconnected', status: 'open', time: '18 Aug 2026, 14:15' },
      { id: 'DISP-89422', battleId: 'BTL-88201', game: 'Snake & Ladders', playerA: 'Rahul (LD20541)', playerB: 'Vikash (LD40192)', entry: 100, prize: 190, claimA: 'Reached 100 first', claimB: 'Wrong screenshot', status: 'open', time: '18 Aug 2026, 13:20' }
    ],

    supportTickets: [
      { id: 'TKT-1048', playerId: 'LD10458', name: 'Rajendra', subject: 'Withdrawal delay inquiry', category: 'Withdrawal', status: 'open', time: '18 Aug 2026, 14:28' },
      { id: 'TKT-1049', playerId: 'LD30912', name: 'Amit', subject: 'KYC Aadhaar verification pending', category: 'KYC', status: 'open', time: '18 Aug 2026, 13:50' },
      { id: 'TKT-1047', playerId: 'LD20541', name: 'Rahul', subject: 'Room code error in match', category: 'Battle', status: 'resolved', time: '18 Aug 2026, 11:10' }
    ],

    employees: [
      { id: 'EMP-001', name: 'Vikram Malhotra', email: 'vikram@ludobet.com', role: 'super_admin', roleLabel: 'SUPER ADMIN', modules: 'All 17 Modules (100% Control)', status: 'active', lastActive: 'Online Now' },
      { id: 'EMP-002', name: 'Priya Sharma', email: 'priya.s@ludobet.com', role: 'finance', roleLabel: 'FINANCE EXEC', modules: 'Finance, Withdrawals, Audit Logs', status: 'active', lastActive: '10 Mins ago' },
      { id: 'EMP-003', name: 'Arun Patel', email: 'arun.p@ludobet.com', role: 'dispute', roleLabel: 'DISPUTE EXEC', modules: 'Disputes, Live Battles', status: 'active', lastActive: '1 Hour ago' },
      { id: 'EMP-004', name: 'Kavita Singh', email: 'kavita@ludobet.com', role: 'kyc', roleLabel: 'KYC EXEC', modules: 'KYC Moderation, Players Directory', status: 'active', lastActive: 'Yesterday' }
    ],

    banners: [
      { id: 'BAN-1', priority: 1, title: '₹1 Lakh Grand Sunday Tournament', action: 'openTournament(T-100K)', schedule: '18 Aug - 24 Aug 2026', clicks: 14820, status: 'active' },
      { id: 'BAN-2', priority: 2, title: 'Add ₹500 & Get ₹100 Extra Cashback', action: 'openWalletAddCash(500)', schedule: 'Always Active', clicks: 9420, status: 'active' }
    ],

    tournaments: [
      { id: 'TRN-101', name: '👑 Mega Sunday Championship', game: 'Ludo Classic 1v1', bracket: 'Knockout Bracket', entryFee: 20, prizePool: 10000, slots: 482, maxSlots: 500, startTime: '10:00 PM', status: 'live' },
      { id: 'TRN-102', name: '⚡ Speed Rush Night', game: 'Ludo Quick', bracket: '1-Token Blitz', entryFee: 10, prizePool: 5000, slots: 120, maxSlots: 250, startTime: '08:00 PM', status: 'upcoming' }
    ],

    auditLogs: [
      { admin: 'Super Admin', role: 'Super Administrator', action: 'Wallet Credit', target: 'LD10458 (Rajendra)', details: '+₹200 Winnings', reason: 'Tourney Winner Compensation', time: '18 Aug 2026, 14:10', ip: '192.168.1.1' },
      { admin: 'Karan Moderator', role: 'KYC Executive', action: 'KYC Approval', target: 'LD10458 (Rajendra)', details: 'Aadhaar Verified', reason: 'Clear original scan', time: '18 Aug 2026, 12:30', ip: '192.168.1.4' },
      { admin: 'Super Admin', role: 'Super Administrator', action: 'Player Ban', target: 'LD50831 (Rohan Cheater)', details: 'Account Freeze', reason: 'Multi-accounting fraud', time: '18 Aug 2026, 11:00', ip: '192.168.1.1' }
    ]
  };

  // --- 3. Role-Based Navigation & Access Filter ---
  const ROLE_PERMISSIONS = {
    super_admin: { label: 'Super Administrator', badge: '👑 SUPER ADMIN', modules: ['dashboard', 'players', 'finance', 'withdrawals', 'kyc', 'games', 'battles', 'tournaments', 'disputes', 'bonuses', 'rewards', 'marketing', 'support', 'security', 'employees', 'settings', 'audit_logs', 'emergency'] },
    support: { label: 'Support Agent', badge: '🎧 SUPPORT DESK', modules: ['dashboard', 'players', 'support'] },
    kyc: { label: 'KYC Executive', badge: '🪪 KYC MODERATOR', modules: ['dashboard', 'kyc', 'players'] },
    finance: { label: 'Finance Executive', badge: '💰 FINANCE DESK', modules: ['dashboard', 'finance', 'withdrawals', 'audit_logs'] },
    dispute: { label: 'Dispute Executive', badge: '⚖️ DISPUTE DESK', modules: ['dashboard', 'disputes', 'battles'] },
    game: { label: 'Game Operator', badge: '🎮 GAME OPERATOR', modules: ['dashboard', 'games', 'battles', 'tournaments'] },
    marketing: { label: 'Marketing Manager', badge: '📢 MARKETING DESK', modules: ['dashboard', 'bonuses', 'rewards', 'marketing'] },
    security: { label: 'Security & Fraud Analyst', badge: '🛡️ SECURITY DESK', modules: ['dashboard', 'security', 'audit_logs', 'players'] }
  };

  window.switchAdminRole = function (roleKey) {
    playAdminSound('click');
    STATE.currentRole = roleKey;
    const roleInfo = ROLE_PERMISSIONS[roleKey] || ROLE_PERMISSIONS.super_admin;
    
    const roleLabel = document.getElementById('header-role-label');
    const roleTag = document.getElementById('header-role-tag');
    if (roleLabel) roleLabel.textContent = roleInfo.label;
    if (roleTag) roleTag.textContent = roleInfo.badge;

    // Filter sidebar navigation if data-tab attributes are present
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      const tab = btn.getAttribute('data-tab');
      if (tab) {
        if (roleInfo.modules.includes(tab)) {
          btn.style.display = 'flex';
        } else {
          btn.style.display = 'none';
        }
      } else {
        btn.style.display = 'flex';
      }
    });

    showToast(`Switched role to ${roleInfo.label}`, '👨‍💼');
  };

  // --- 4. Tab Navigation Switcher ---
  window.switchTab = function (tabName) {
    playAdminSound('click');
    STATE.currentTab = tabName;

    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.admin-view-panel').forEach(panel => {
      if (panel.id === `view-${tabName}`) {
        panel.style.display = 'flex';
      } else {
        panel.style.display = 'none';
      }
    });

    // Specific renders
    if (tabName === 'players') renderPlayersTable();
    if (tabName === 'finance') renderDepositsTable();
    if (tabName === 'withdrawals') renderWithdrawalsTable();
    if (tabName === 'kyc') renderKYCTable();
    if (tabName === 'disputes') renderDisputesTable();
    if (tabName === 'support') renderSupportTable();
    if (tabName === 'audit_logs') renderAuditLogsTable();
  };

  // --- 5. Data Tables Rendering Engine ---
  STATE.playerFilter = 'all';
  STATE.playerSort = 'newest';
  STATE.playerSearch = '';

  window.setPlayerFilter = function (btn, filterType) {
    playAdminSound('click');
    STATE.playerFilter = filterType;
    
    document.querySelectorAll('#player-filter-chips .filter-chip-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    renderPlayersTable();
  };

  window.setPlayerSort = function (sortKey) {
    playAdminSound('click');
    STATE.playerSort = sortKey;
    renderPlayersTable();
  };

  let sortDirections = {};
  window.toggleSortColumn = function (colKey) {
    playAdminSound('click');
    const currentDir = sortDirections[colKey] === 'asc' ? 'desc' : 'asc';
    sortDirections[colKey] = currentDir;

    if (colKey === 'id') {
      STATE.playerSort = currentDir === 'asc' ? 'id_asc' : 'id_desc';
    } else if (colKey === 'name') {
      STATE.playerSort = currentDir === 'asc' ? 'name_asc' : 'name_desc';
    } else if (colKey === 'balance') {
      STATE.playerSort = currentDir === 'asc' ? 'balance_asc' : 'balance_desc';
    } else if (colKey === 'battles') {
      STATE.playerSort = currentDir === 'asc' ? 'battles_asc' : 'battles_desc';
    } else if (colKey === 'joined') {
      STATE.playerSort = currentDir === 'asc' ? 'oldest' : 'newest';
    } else if (colKey === 'kyc') {
      STATE.playerSort = currentDir === 'asc' ? 'kyc_asc' : 'kyc_desc';
    } else if (colKey === 'status') {
      STATE.playerSort = currentDir === 'asc' ? 'status_asc' : 'status_desc';
    }

    renderPlayersTable();
  };

  function renderPlayersTable() {
    const tbody = document.getElementById('players-table-body');
    if (!tbody) return;

    let list = [...STATE.players];

    // 1. Text Search Filter
    if (STATE.playerSearch) {
      const q = STATE.playerSearch.toLowerCase();
      list = list.filter(p => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.phone.includes(q));
    }

    // 2. Chip Filter (ALL, KYC VERIFIED, KYC PENDING, BANNED)
    if (STATE.playerFilter === 'approved') {
      list = list.filter(p => p.kyc === 'approved');
    } else if (STATE.playerFilter === 'pending') {
      list = list.filter(p => p.kyc === 'pending');
    } else if (STATE.playerFilter === 'banned') {
      list = list.filter(p => p.status === 'banned');
    }

    // 3. Sorting
    if (STATE.playerSort === 'newest') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (STATE.playerSort === 'oldest') {
      list.sort((a, b) => a.id.localeCompare(b.id));
    } else if (STATE.playerSort === 'balance_desc') {
      list.sort((a, b) => (b.deposit + b.winnings + b.bonus) - (a.deposit + a.winnings + a.bonus));
    } else if (STATE.playerSort === 'balance_asc') {
      list.sort((a, b) => (a.deposit + a.winnings + a.bonus) - (b.deposit + b.winnings + b.bonus));
    } else if (STATE.playerSort === 'battles_desc' || STATE.playerSort === 'battles_asc') {
      list.sort((a, b) => STATE.playerSort === 'battles_desc' ? b.battles - a.battles : a.battles - b.battles);
    } else if (STATE.playerSort === 'winrate_desc') {
      list.sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));
    } else if (STATE.playerSort === 'name_asc' || STATE.playerSort === 'name_desc') {
      list.sort((a, b) => STATE.playerSort === 'name_asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    } else if (STATE.playerSort === 'id_asc' || STATE.playerSort === 'id_desc') {
      list.sort((a, b) => STATE.playerSort === 'id_asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id));
    }

    tbody.innerHTML = list.map(p => {
      const totalBal = p.deposit + p.winnings + p.bonus;
      return `
        <tr>
          <td><strong>${p.id}</strong></td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="user-mini-icon bubble-blue" style="width:28px; height:28px; font-size:13px;">👤</div>
              <div>
                <div style="font-weight:800; color:#0f172a;">${p.name}</div>
                <div style="font-size:10px; color:#64748b;">${p.phone}</div>
              </div>
            </div>
          </td>
          <td>${p.joined}</td>
          <td><span class="status-pill-badge ${p.kyc}">${p.kyc.toUpperCase()}</span></td>
          <td><strong>₹${totalBal}</strong> <span style="font-size:9.5px; color:#64748b;">(W: ₹${p.winnings})</span></td>
          <td><span class="status-pill-badge ${p.status}">${p.status.toUpperCase()}</span></td>
          <td>${p.battles} (${p.winRate})</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn-table-action" onclick="openPlayerDrawer('${p.id}')">VIEW ➔</button>
              <button class="btn-table-action" onclick="openWalletAdjustModal('${p.id}')">± WALLET</button>
              <button class="btn-table-action ${p.status === 'banned' ? '' : 'danger'}" onclick="toggleBanPlayer('${p.id}')">
                ${p.status === 'banned' ? 'UNBAN' : 'BAN'}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Update filter counts
    const chipAll = document.getElementById('chip-all');
    const chipKyc = document.getElementById('chip-kyc');
    const chipPending = document.getElementById('chip-pending');
    const chipBanned = document.getElementById('chip-banned');

    if (chipAll) chipAll.textContent = `ALL (${STATE.players.length})`;
    if (chipKyc) chipKyc.textContent = `KYC VERIFIED (${STATE.players.filter(p => p.kyc === 'approved').length})`;
    if (chipPending) chipPending.textContent = `KYC PENDING (${STATE.players.filter(p => p.kyc === 'pending').length})`;
    if (chipBanned) chipBanned.textContent = `BANNED (${STATE.players.filter(p => p.status === 'banned').length})`;
  }

  function renderDepositsTable() {
    const tbody = document.getElementById('deposits-table-body');
    if (!tbody) return;

    tbody.innerHTML = STATE.deposits.map(d => `
      <tr>
        <td><strong>${d.id}</strong></td>
        <td>${d.playerId} (${d.name})</td>
        <td><strong style="color:#10b981;">₹${d.amount}</strong></td>
        <td>${d.method}</td>
        <td><code>${d.utr}</code></td>
        <td><span class="status-pill-badge ${d.status}">${d.status.toUpperCase()}</span></td>
        <td>${d.time}</td>
        <td>
          ${d.status === 'pending' ? `
            <button class="btn-table-action" onclick="approveDeposit('${d.id}')">APPROVE ✓</button>
          ` : '<span>-</span>'}
        </td>
      </tr>
    `).join('');
  }

  function renderWithdrawalsTable() {
    const tbody = document.getElementById('withdrawals-table-body');
    if (!tbody) return;

    tbody.innerHTML = STATE.withdrawals.map(w => `
      <tr>
        <td><strong>${w.id}</strong></td>
        <td>${w.playerId} (${w.name})</td>
        <td><strong>₹${w.amount}</strong></td>
        <td style="color:#ef4444;">-₹${w.tds}</td>
        <td><strong style="color:#10b981;">₹${w.net}</strong></td>
        <td><code>${w.payout}</code></td>
        <td><span class="status-pill-badge ${w.status}">${w.status.toUpperCase()}</span></td>
        <td>${w.time}</td>
        <td>
          ${w.status === 'pending' ? `
            <button class="btn-table-action" style="background:#dcfce7; color:#15803d;" onclick="openPayoutModal('${w.id}')">PAYOUT ➔</button>
            <button class="btn-table-action danger" onclick="rejectWithdrawal('${w.id}')">REJECT</button>
          ` : `<code>${w.utr || 'PROCESSED'}</code>`}
        </td>
      </tr>
    `).join('');
  }

  function renderKYCTable() {
    const tbody = document.getElementById('kyc-table-body');
    if (!tbody) return;

    tbody.innerHTML = STATE.kycQueue.map(k => `
      <tr>
        <td>${k.playerId}</td>
        <td><strong>${k.name}</strong></td>
        <td>${k.docType}</td>
        <td><code>${k.docNum}</code></td>
        <td><span class="status-pill-badge ${k.status}">${k.status.toUpperCase()}</span></td>
        <td>${k.time}</td>
        <td>
          <button class="btn-table-action" onclick="openKYCViewerModal('${k.playerId}')">REVIEW DOCS ➔</button>
        </td>
      </tr>
    `).join('');
  }

  function renderDisputesTable() {
    const tbody = document.getElementById('disputes-table-body');
    if (!tbody) return;

    tbody.innerHTML = STATE.disputes.map(d => `
      <tr>
        <td><strong>${d.id}</strong></td>
        <td><code>${d.battleId}</code> (${d.game})</td>
        <td>${d.playerA}</td>
        <td>${d.playerB}</td>
        <td><strong>₹${d.prize}</strong></td>
        <td><span class="status-pill-badge pending">UNDER REVIEW</span></td>
        <td>
          <button class="btn-table-action" style="background:#fee2e2; color:#b91c1c;" onclick="openDisputeEvidenceModal('${d.id}')">
            VERIFY EVIDENCE ⚖️
          </button>
        </td>
      </tr>
    `).join('');
  }

  function renderSupportTable() {
    const tbody = document.getElementById('support-table-body');
    if (!tbody) return;

    tbody.innerHTML = STATE.supportTickets.map(t => `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${t.playerId} (${t.name})</td>
        <td><strong>${t.subject}</strong></td>
        <td><span class="status-pill-badge active">${t.category}</span></td>
        <td><span class="status-pill-badge ${t.status === 'open' ? 'pending' : 'approved'}">${t.status.toUpperCase()}</span></td>
        <td>${t.time}</td>
        <td>
          <button class="btn-table-action" onclick="openSupportReplyModal('${t.id}')">REPLY ➔</button>
        </td>
      </tr>
    `).join('');
  }

  function renderAuditLogsTable() {
    const tbody = document.getElementById('audit-table-body');
    if (!tbody) return;

    tbody.innerHTML = STATE.auditLogs.map(a => `
      <tr>
        <td><strong>${a.admin}</strong> <div style="font-size:9.5px; color:#64748b;">${a.role}</div></td>
        <td><span class="status-pill-badge active">${a.action}</span></td>
        <td>${a.target}</td>
        <td><strong>${a.details}</strong></td>
        <td><em>"${a.reason}"</em></td>
        <td>${a.time}</td>
        <td><code>${a.ip}</code></td>
      </tr>
    `).join('');
  }

  // --- 6. Interactive Player Drawer & Actions ---
  window.switchPlayerDrawerTab = function (btn, tabId) {
    playAdminSound('click');
    document.querySelectorAll('.player-drawer-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.player-tab-pane').forEach(pane => {
      if (pane.id === `ptab-${tabId}`) {
        pane.style.display = 'flex';
      } else {
        pane.style.display = 'none';
      }
    });
  };

  window.openPlayerDrawer = function (playerId) {
    playAdminSound('click');
    const overlay = document.getElementById('player-drawer-overlay');
    if (!overlay) {
      window.location.href = `player-view.html?id=${playerId}`;
      return;
    }

    const player = STATE.players.find(p => p.id === playerId);
    if (!player) return;

    const totalBal = player.deposit + player.winnings + player.bonus;

    document.getElementById('drawer-player-id').textContent = player.id;
    document.getElementById('drawer-player-name').textContent = player.name;
    document.getElementById('drawer-player-phone').textContent = player.phone;
    document.getElementById('drawer-player-deposit').textContent = `₹${player.deposit}`;
    document.getElementById('drawer-player-winnings').textContent = `₹${player.winnings}`;
    document.getElementById('drawer-player-bonus').textContent = `₹${player.bonus}`;
    document.getElementById('drawer-player-total').textContent = `₹${totalBal}`;
    document.getElementById('drawer-player-battles').textContent = player.battles;
    document.getElementById('drawer-player-wins').textContent = `${player.wins} (${player.winRate})`;
    document.getElementById('drawer-player-joined').textContent = player.joined;
    document.getElementById('drawer-player-email').textContent = `${player.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;

    // Badges
    const kycBadge = document.getElementById('drawer-player-kyc-badge');
    if (kycBadge) {
      kycBadge.className = `status-pill-badge ${player.kyc}`;
      kycBadge.textContent = `KYC ${player.kyc.toUpperCase()}`;
    }

    const statusBadge = document.getElementById('drawer-player-status-badge');
    if (statusBadge) {
      statusBadge.className = `status-pill-badge ${player.status}`;
      statusBadge.textContent = player.status.toUpperCase();
    }

    // Default to first tab (Overview)
    const firstTabBtn = document.querySelector('.player-drawer-tab-btn');
    if (firstTabBtn) switchPlayerDrawerTab(firstTabBtn, 'poverview');

    if (overlay) overlay.classList.add('show');
  };

  window.closePlayerDrawer = function () {
    playAdminSound('click');
    const overlay = document.getElementById('player-drawer-overlay');
    if (overlay) overlay.classList.remove('show');
  };

  // --- 7. Sensitive Action Audit Modals & Execution ---
  window.openWalletAdjustModal = function (playerId) {
    playAdminSound('click');
    STATE.selectedPlayerId = playerId;
    document.getElementById('adj-target-player').textContent = playerId;
    document.getElementById('modal-wallet-adjust').classList.add('show');
  };

  window.closeWalletAdjustModal = function () {
    document.getElementById('modal-wallet-adjust').classList.remove('show');
  };

  window.submitWalletAdjustment = function () {
    const amt = parseFloat(document.getElementById('adj-amount-input').value) || 0;
    const type = document.getElementById('adj-type-select').value; // 'credit' | 'debit'
    const wallet = document.getElementById('adj-wallet-select').value; // 'winnings' | 'deposit' | 'bonus'
    const reason = document.getElementById('adj-reason-input').value.trim();

    if (amt <= 0) {
      showToast('Please enter a valid adjustment amount', '⚠️');
      return;
    }
    if (!reason) {
      showToast('Mandatory: Admin reason required for audit log', '⚠️');
      return;
    }

    const player = STATE.players.find(p => p.id === STATE.selectedPlayerId);
    if (player) {
      if (type === 'credit') {
        player[wallet] += amt;
      } else {
        player[wallet] = Math.max(0, player[wallet] - amt);
      }
    }

    // Record Audit Log
    STATE.auditLogs.unshift({
      admin: ROLE_PERMISSIONS[STATE.currentRole].label,
      role: ROLE_PERMISSIONS[STATE.currentRole].badge,
      action: `Wallet ${type.toUpperCase()}`,
      target: `${player.id} (${player.name})`,
      details: `${type === 'credit' ? '+' : '-'}₹${amt} (${wallet})`,
      reason: reason,
      time: 'Just Now',
      ip: '192.168.1.10'
    });

    closeWalletAdjustModal();
    playAdminSound('success');
    showToast(`Wallet ${type.toUpperCase()} of ₹${amt} executed & logged!`, '💰');
    renderPlayersTable();
  };

  // --- 6.1 Payout Approval & Rejection Engine ---
  window.openPayoutModal = function (wdrId) {
    playAdminSound('click');
    const w = STATE.withdrawals.find(item => item.id === wdrId);
    if (!w) return;
    const utr = prompt(`Enter Banking / UPI Payout UTR for ${w.id} (Net: ₹${w.net} to ${w.payout}):`, `UPI-${Math.floor(1000000000 + Math.random()*9000000000)}`);
    if (utr) {
      playAdminSound('success');
      w.status = 'approved';
      w.utr = utr;
      showToast(`Payout ₹${w.net} Approved! UTR: ${utr}`, '✅');
      STATE.auditLogs.unshift({
        admin: 'Finance Executive',
        role: 'Finance Officer',
        action: 'Withdrawal Payout Approved',
        target: `${w.playerId} (${w.name})`,
        details: `Net Paid: ₹${w.net} | UTR: ${utr}`,
        reason: 'Verified bank payout release',
        time: 'Just now',
        ip: '192.168.1.8'
      });
      renderWithdrawalsTable();
      renderAuditLogsTable();
    }
  };

  window.rejectWithdrawal = function (wdrId) {
    playAdminSound('click');
    const w = STATE.withdrawals.find(item => item.id === wdrId);
    if (!w) return;
    const reason = prompt(`Reason for rejecting withdrawal ${w.id} (Player: ${w.name}):`, 'Unverified bank account details or name mismatch');
    if (reason) {
      playAdminSound('warn');
      w.status = 'rejected';
      showToast(`Withdrawal ${w.id} rejected and refunded to player wallet.`, '⚠️');
      STATE.auditLogs.unshift({
        admin: 'Finance Executive',
        role: 'Finance Officer',
        action: 'Withdrawal Payout Rejected',
        target: `${w.playerId} (${w.name})`,
        details: `Refunded: ₹${w.amount}`,
        reason: reason,
        time: 'Just now',
        ip: '192.168.1.8'
      });
      renderWithdrawalsTable();
      renderAuditLogsTable();
    }
  };

  window.toggleBanPlayer = function (playerId) {
    const player = STATE.players.find(p => p.id === playerId);
    if (!player) return;

    const newStatus = player.status === 'banned' ? 'active' : 'banned';
    player.status = newStatus;

    STATE.auditLogs.unshift({
      admin: ROLE_PERMISSIONS[STATE.currentRole].label,
      role: ROLE_PERMISSIONS[STATE.currentRole].badge,
      action: newStatus === 'banned' ? 'Player BAN' : 'Player UNBAN',
      target: `${player.id} (${player.name})`,
      details: `Status changed to ${newStatus.toUpperCase()}`,
      reason: 'Security & Fairplay Compliance Review',
      time: 'Just Now',
      ip: '192.168.1.10'
    });

    playAdminSound(newStatus === 'banned' ? 'warn' : 'success');
    showToast(`Player ${player.id} is now ${newStatus.toUpperCase()}!`, '🛡️');
    renderPlayersTable();
  };

  // --- 8. KYC Viewer Modal ---
  window.openKYCViewerModal = function (playerId) {
    playAdminSound('click');
    STATE.selectedPlayerId = playerId;
    document.getElementById('kyc-modal-player-id').textContent = playerId;
    document.getElementById('modal-kyc-viewer').classList.add('show');
  };

  window.closeKYCViewerModal = function () {
    document.getElementById('modal-kyc-viewer').classList.remove('show');
  };

  window.toggleSidebarDropdown = function (btn) {
    playAdminSound('click');
    const parentGroup = btn.closest('.nav-dropdown-group');
    if (!parentGroup) return;
    const submenu = parentGroup.querySelector('.sidebar-submenu');
    if (submenu) {
      submenu.classList.toggle('open');
      const arrow = btn.querySelector('.nav-dropdown-arrow');
      if (arrow) {
        arrow.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  };

  window.approveKYCDoc = function () {
    const targetPlayer = STATE.selectedPlayerId;
    const player = STATE.players.find(p => p.id === targetPlayer);
    if (player) player.kyc = 'approved';

    const queueItem = STATE.kycQueue.find(k => k.playerId === targetPlayer);
    STATE.kycQueue = STATE.kycQueue.filter(k => k.playerId !== targetPlayer);

    const verId = `KYC-VER-${Math.floor(10000 + Math.random() * 90000)}`;
    const reasonText = 'Valid Government Document verified & approved';

    STATE.kycHistory.unshift({
      id: verId,
      playerId: targetPlayer,
      name: (player && player.name) || (queueItem && queueItem.name) || 'Player',
      docType: (queueItem && queueItem.docType) || 'Aadhaar / PAN',
      docNum: (queueItem && queueItem.docNum) || 'XXXX-XXXX-8921',
      verdict: 'approved',
      admin: ROLE_PERMISSIONS[STATE.currentRole].label,
      role: ROLE_PERMISSIONS[STATE.currentRole].badge,
      reason: reasonText,
      time: 'Just Now',
      ip: '192.168.1.10'
    });

    STATE.auditLogs.unshift({
      admin: ROLE_PERMISSIONS[STATE.currentRole].label,
      role: ROLE_PERMISSIONS[STATE.currentRole].badge,
      action: 'KYC Approval',
      target: targetPlayer,
      details: 'Aadhaar & PAN Approved',
      reason: reasonText,
      time: 'Just Now',
      ip: '192.168.1.10'
    });

    closeKYCViewerModal();
    playAdminSound('success');
    showToast(`KYC Approved for ${targetPlayer}! Saved to KYC History.`, '✅');
    renderKYCTable();
    renderKYCHistoryTable();
  };

  window.rejectKYCDoc = function (customReason) {
    const targetPlayer = STATE.selectedPlayerId;
    const player = STATE.players.find(p => p.id === targetPlayer);
    if (player) player.kyc = 'rejected';

    const queueItem = STATE.kycQueue.find(k => k.playerId === targetPlayer);
    STATE.kycQueue = STATE.kycQueue.filter(k => k.playerId !== targetPlayer);

    const verId = `KYC-VER-${Math.floor(10000 + Math.random() * 90000)}`;
    const reasonText = customReason || 'Document blurry / UID name mismatch with profile';

    STATE.kycHistory.unshift({
      id: verId,
      playerId: targetPlayer,
      name: (player && player.name) || (queueItem && queueItem.name) || 'Player',
      docType: (queueItem && queueItem.docType) || 'Aadhaar / PAN',
      docNum: (queueItem && queueItem.docNum) || 'XXXX-XXXX-8921',
      verdict: 'rejected',
      admin: ROLE_PERMISSIONS[STATE.currentRole].label,
      role: ROLE_PERMISSIONS[STATE.currentRole].badge,
      reason: reasonText,
      time: 'Just Now',
      ip: '192.168.1.10'
    });

    STATE.auditLogs.unshift({
      admin: ROLE_PERMISSIONS[STATE.currentRole].label,
      role: ROLE_PERMISSIONS[STATE.currentRole].badge,
      action: 'KYC Rejection',
      target: targetPlayer,
      details: 'Aadhaar / PAN Rejected',
      reason: reasonText,
      time: 'Just Now',
      ip: '192.168.1.10'
    });

    closeKYCViewerModal();
    playAdminSound('warn');
    showToast(`KYC Rejected for ${targetPlayer}! Logged to KYC History.`, '❌');
    renderKYCTable();
    renderKYCHistoryTable();
  };

  STATE.kycHistoryFilter = 'all';

  window.filterKYCHistory = function (btn, filterType) {
    playAdminSound('click');
    STATE.kycHistoryFilter = filterType;
    document.querySelectorAll('#kyc-history-chips .filter-chip-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderKYCHistoryTable();
  };

  window.renderKYCHistoryTable = function (searchQuery = '') {
    const tbody = document.getElementById('kyc-history-table-body');
    if (!tbody) return;

    let list = [...STATE.kycHistory];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(k => 
        k.id.toLowerCase().includes(q) || 
        k.playerId.toLowerCase().includes(q) || 
        k.name.toLowerCase().includes(q) ||
        k.docNum.toLowerCase().includes(q) ||
        k.admin.toLowerCase().includes(q)
      );
    }

    if (STATE.kycHistoryFilter === 'approved') {
      list = list.filter(k => k.verdict === 'approved');
    } else if (STATE.kycHistoryFilter === 'rejected') {
      list = list.filter(k => k.verdict === 'rejected');
    }

    tbody.innerHTML = list.map(k => `
      <tr>
        <td><strong>${k.id}</strong></td>
        <td>
          <div style="font-weight:800; color:#0f172a;">${k.playerId}</div>
          <div style="font-size:11px; color:#64748b;">${k.name}</div>
        </td>
        <td>
          <div>${k.docType}</div>
          <code style="font-size:10.5px;">${k.docNum}</code>
        </td>
        <td>
          <span class="status-pill-badge ${k.verdict}">${k.verdict === 'approved' ? 'APPROVED ✅' : 'REJECTED ❌'}</span>
        </td>
        <td>
          <div style="font-weight:700;">${k.admin}</div>
          <span style="font-size:9.5px; color:#64748b;">${k.role}</span>
        </td>
        <td><em>"${k.reason}"</em></td>
        <td>${k.time}</td>
        <td><code>${k.ip}</code></td>
        <td>
          <button class="btn-table-action" onclick="viewKYCHistorySnapshot('${k.id}')">VIEW 📄</button>
        </td>
      </tr>
    `).join('');
  };

  // --- 9. KYC Verified Document Snapshot Modal Controller ---
  window.viewKYCHistorySnapshot = function (historyId) {
    playAdminSound('click');
    const record = STATE.kycHistory.find(k => k.id === historyId);
    if (!record) return;

    const modal = document.getElementById('modal-kyc-snapshot-viewer');
    if (!modal) {
      showToast(`Verified Document: ${record.docType} (${record.docNum})`, '📄');
      return;
    }

    document.getElementById('kyc-snap-id').textContent = record.id;
    document.getElementById('kyc-snap-verdict').innerHTML = record.verdict === 'approved' 
      ? '<span class="status-pill-badge approved">APPROVED ✅</span>' 
      : '<span class="status-pill-badge rejected">REJECTED ❌</span>';
    document.getElementById('kyc-snap-player').textContent = `${record.name} (${record.playerId})`;
    document.getElementById('kyc-snap-doctype').textContent = record.docType;
    document.getElementById('kyc-snap-docnum').textContent = record.docNum;
    document.getElementById('kyc-snap-admin').textContent = `${record.admin} (${record.role})`;
    document.getElementById('kyc-snap-time').textContent = record.time;
    document.getElementById('kyc-snap-ip').textContent = record.ip;
    document.getElementById('kyc-snap-reason').textContent = record.reason;

    modal.classList.add('show');
  };

  window.closeKYCSnapshotModal = function () {
    const modal = document.getElementById('modal-kyc-snapshot-viewer');
    if (modal) modal.classList.remove('show');
  };

  // --- 10. Dispute Resolution Engine ---
  window.openDisputeEvidenceModal = function (dispId) {
    playAdminSound('click');
    const disp = STATE.disputes.find(d => d.id === dispId);
    if (!disp) return;

    document.getElementById('disp-modal-id').textContent = disp.id;
    document.getElementById('disp-modal-battle').textContent = `${disp.battleId} (${disp.game} - ₹${disp.prize} Pool)`;
    document.getElementById('modal-dispute-viewer').classList.add('show');
  };

  window.closeDisputeEvidenceModal = function () {
    document.getElementById('modal-dispute-viewer').classList.remove('show');
  };

  window.resolveDisputeVerdict = function (verdictType) {
    playAdminSound('success');
    closeDisputeEvidenceModal();
    showToast(`Dispute resolved! Verdict: ${verdictType.toUpperCase()}`, '⚖️');
  };

  // --- 11. Support Ticket Reply & Resolution Console ---
  window.openSupportReplyModal = function (ticketId) {
    playAdminSound('click');
    const ticket = STATE.supportTickets.find(t => t.id === ticketId);
    if (!ticket) return;
    STATE.activeTicketId = ticketId;

    const modal = document.getElementById('modal-support-reply');
    if (!modal) return;

    document.getElementById('modal-support-ticket-id').textContent = `${ticket.id} - ${ticket.name} (${ticket.playerId})`;
    document.getElementById('modal-support-category').textContent = ticket.category;
    document.getElementById('modal-support-subject').textContent = ticket.subject;
    document.getElementById('modal-support-created').textContent = ticket.time;
    document.getElementById('modal-support-status').textContent = ticket.status.toUpperCase();
    document.getElementById('support-reply-textarea').value = '';
    modal.classList.add('show');
  };

  window.closeSupportReplyModal = function () {
    const modal = document.getElementById('modal-support-reply');
    if (modal) modal.classList.remove('show');
  };

  window.insertCannedReply = function (text) {
    playAdminSound('click');
    const textarea = document.getElementById('support-reply-textarea');
    if (textarea) {
      textarea.value = text;
      textarea.focus();
    }
  };

  window.submitSupportReply = function (newStatus) {
    const replyText = (document.getElementById('support-reply-textarea')?.value || '').trim();
    if (!replyText) {
      showToast('Please type a reply message before submitting', '⚠️');
      return;
    }

    playAdminSound('success');
    const ticket = STATE.supportTickets.find(t => t.id === STATE.activeTicketId);
    if (ticket) {
      ticket.status = newStatus;
      showToast(`Reply dispatched to ${ticket.name}! Ticket is now ${newStatus.toUpperCase()}`, '✉️');

      STATE.auditLogs.unshift({
        admin: 'Support Staff',
        role: 'Support Agent',
        action: 'Support Ticket Reply',
        target: `${ticket.playerId} (${ticket.name})`,
        details: `Ticket: ${ticket.id} [${newStatus.toUpperCase()}]`,
        reason: `Reply: "${replyText.substring(0, 45)}..."`,
        time: 'Just now',
        ip: '192.168.1.5'
      });
    }

    closeSupportReplyModal();
    renderSupportTable();
    renderAuditLogsTable();
  };

  // --- 12. Employee Directory & RBAC Controller ---
  window.renderEmployeesTable = function () {
    const tbody = document.getElementById('employees-table-body');
    if (!tbody) return;
    tbody.innerHTML = STATE.employees.map(emp => `
      <tr>
        <td><code>${emp.id}</code></td>
        <td><strong>${emp.name}</strong> <div style="font-size:10.5px; color:#64748b;">${emp.email}</div></td>
        <td><span class="status-pill-badge active">${emp.roleLabel}</span></td>
        <td>${emp.modules}</td>
        <td><span class="status-pill-badge ${emp.status === 'active' ? 'approved' : 'rejected'}">${emp.status.toUpperCase()}</span></td>
        <td>${emp.lastActive}</td>
        <td>
          <button class="btn-table-action" onclick="openEditEmployeeModal('${emp.id}')">EDIT ✏️</button>
          <button class="btn-table-action ${emp.status === 'active' ? 'danger' : ''}" onclick="toggleEmployeeStatus('${emp.id}')">
            ${emp.status === 'active' ? 'DEACTIVATE' : 'ACTIVATE'}
          </button>
        </td>
      </tr>
    `).join('');
  };

  window.openAddEmployeeModal = function () {
    playAdminSound('click');
    const modal = document.getElementById('modal-employee-form');
    if (!modal) return;
    document.getElementById('emp-form-modal-title').textContent = '➕ Add New Staff Member';
    document.getElementById('emp-edit-id').value = '';
    document.getElementById('emp-name-input').value = '';
    document.getElementById('emp-email-input').value = '';
    document.getElementById('emp-role-select').value = 'support';
    document.getElementById('emp-status-select').value = 'active';
    modal.classList.add('show');
  };

  window.openEditEmployeeModal = function (empId) {
    playAdminSound('click');
    const emp = STATE.employees.find(e => e.id === empId);
    if (!emp) return;
    const modal = document.getElementById('modal-employee-form');
    if (!modal) return;
    document.getElementById('emp-form-modal-title').textContent = `✏️ Edit Staff: ${emp.name} (${emp.id})`;
    document.getElementById('emp-edit-id').value = emp.id;
    document.getElementById('emp-name-input').value = emp.name;
    document.getElementById('emp-email-input').value = emp.email;
    document.getElementById('emp-role-select').value = emp.role;
    document.getElementById('emp-status-select').value = emp.status;
    modal.classList.add('show');
  };

  window.closeEmployeeModal = function () {
    const modal = document.getElementById('modal-employee-form');
    if (modal) modal.classList.remove('show');
  };

  window.saveEmployeeForm = function (e) {
    if (e) e.preventDefault();
    playAdminSound('success');
    const empId = document.getElementById('emp-edit-id').value;
    const name = document.getElementById('emp-name-input').value.trim();
    const email = document.getElementById('emp-email-input').value.trim();
    const role = document.getElementById('emp-role-select').value;
    const status = document.getElementById('emp-status-select').value;

    if (!name || !email) {
      showToast('Please enter full name and email address', '⚠️');
      return;
    }

    const roleInfo = ROLE_PERMISSIONS[role] || { label: 'Staff Agent', badge: role.toUpperCase(), modules: ['dashboard'] };
    const modulesLabel = role === 'super_admin' ? 'All 17 Modules (100% Control)' : roleInfo.modules.join(', ');

    if (empId) {
      const emp = STATE.employees.find(e => e.id === empId);
      if (emp) {
        emp.name = name;
        emp.email = email;
        emp.role = role;
        emp.roleLabel = roleInfo.badge;
        emp.modules = modulesLabel;
        emp.status = status;
        showToast(`Staff member ${name} updated!`, '✅');
      }
    } else {
      const newId = `EMP-00${STATE.employees.length + 1}`;
      STATE.employees.push({
        id: newId,
        name,
        email,
        role,
        roleLabel: roleInfo.badge,
        modules: modulesLabel,
        status,
        lastActive: 'Just Added'
      });
      showToast(`New staff member ${name} (${newId}) registered!`, '🎉');
    }

    STATE.auditLogs.unshift({
      admin: 'Super Admin',
      role: 'Super Administrator',
      action: empId ? 'Employee Updated' : 'Employee Created',
      target: name,
      details: `Role: ${roleInfo.badge}`,
      reason: 'Staff directory permission configuration',
      time: 'Just now',
      ip: '192.168.1.1'
    });

    closeEmployeeModal();
    renderEmployeesTable();
    renderAuditLogsTable();
  };

  window.toggleEmployeeStatus = function (empId) {
    playAdminSound('click');
    const emp = STATE.employees.find(e => e.id === empId);
    if (!emp) return;
    emp.status = emp.status === 'active' ? 'suspended' : 'active';
    showToast(`${emp.name} account status set to ${emp.status.toUpperCase()}`, '🛡️');
    STATE.auditLogs.unshift({
      admin: 'Super Admin',
      role: 'Super Administrator',
      action: 'Staff Status Toggle',
      target: `${emp.id} (${emp.name})`,
      details: `Status: ${emp.status}`,
      reason: 'Security access revision',
      time: 'Just now',
      ip: '192.168.1.1'
    });
    renderEmployeesTable();
    renderAuditLogsTable();
  };

  // --- 13. Home Carousel Banners CMS Controller ---
  window.renderBannersTable = function () {
    const tbody = document.getElementById('banners-table-body');
    if (!tbody) return;
    tbody.innerHTML = STATE.banners.map(b => `
      <tr>
        <td><strong>#${b.priority}</strong></td>
        <td><strong style="color:#0f172a;">${b.title}</strong></td>
        <td><code>${b.action}</code></td>
        <td>${b.schedule}</td>
        <td><strong>${b.clicks.toLocaleString()} Clicks</strong></td>
        <td><span class="status-pill-badge ${b.status === 'active' ? 'approved' : 'rejected'}">${b.status === 'active' ? 'LIVE ACTIVE' : 'DISABLED'}</span></td>
        <td>
          <button class="btn-table-action" onclick="openEditBannerModal('${b.id}')">EDIT ✏️</button>
          <button class="btn-table-action ${b.status === 'active' ? 'danger' : ''}" onclick="toggleBannerStatus('${b.id}')">
            ${b.status === 'active' ? 'DISABLE' : 'ENABLE'}
          </button>
        </td>
      </tr>
    `).join('');
  };

  window.openAddBannerModal = function () {
    playAdminSound('click');
    const modal = document.getElementById('modal-banner-form');
    if (!modal) return;
    document.getElementById('banner-form-modal-title').textContent = '➕ Upload & Configure New Banner';
    document.getElementById('banner-edit-id').value = '';
    document.getElementById('banner-title-input').value = '';
    document.getElementById('banner-action-input').value = 'openTournament(T-100K)';
    document.getElementById('banner-schedule-input').value = 'Always Active';
    document.getElementById('banner-priority-input').value = STATE.banners.length + 1;
    modal.classList.add('show');
  };

  window.openEditBannerModal = function (bannerId) {
    playAdminSound('click');
    const banner = STATE.banners.find(b => b.id === bannerId);
    if (!banner) return;
    const modal = document.getElementById('modal-banner-form');
    if (!modal) return;
    document.getElementById('banner-form-modal-title').textContent = `✏️ Edit Banner #${banner.priority}`;
    document.getElementById('banner-edit-id').value = banner.id;
    document.getElementById('banner-title-input').value = banner.title;
    document.getElementById('banner-action-input').value = banner.action;
    document.getElementById('banner-schedule-input').value = banner.schedule;
    document.getElementById('banner-priority-input').value = banner.priority;
    modal.classList.add('show');
  };

  window.closeBannerModal = function () {
    const modal = document.getElementById('modal-banner-form');
    if (modal) modal.classList.remove('show');
  };

  window.saveBannerForm = function (e) {
    if (e) e.preventDefault();
    playAdminSound('success');
    const bannerId = document.getElementById('banner-edit-id').value;
    const title = document.getElementById('banner-title-input').value.trim();
    const action = document.getElementById('banner-action-input').value.trim();
    const schedule = document.getElementById('banner-schedule-input').value.trim();
    const priority = parseInt(document.getElementById('banner-priority-input').value, 10) || 1;

    if (!title) {
      showToast('Please enter banner title', '⚠️');
      return;
    }

    if (bannerId) {
      const banner = STATE.banners.find(b => b.id === bannerId);
      if (banner) {
        banner.title = title;
        banner.action = action;
        banner.schedule = schedule;
        banner.priority = priority;
        showToast('Banner configuration saved!', '🖼️');
      }
    } else {
      const newId = `BAN-${STATE.banners.length + 1}`;
      STATE.banners.push({
        id: newId,
        priority,
        title,
        action,
        schedule,
        clicks: 0,
        status: 'active'
      });
      showToast('New homepage promotional banner activated!', '🎉');
    }

    STATE.auditLogs.unshift({
      admin: 'Marketing Manager',
      role: 'Marketing Lead',
      action: bannerId ? 'Banner Modified' : 'Banner Created',
      target: `Carousel #${priority}`,
      details: title,
      reason: 'Home promotion campaign update',
      time: 'Just now',
      ip: '192.168.1.12'
    });

    closeBannerModal();
    renderBannersTable();
    renderAuditLogsTable();
  };

  window.toggleBannerStatus = function (bannerId) {
    playAdminSound('click');
    const banner = STATE.banners.find(b => b.id === bannerId);
    if (!banner) return;
    banner.status = banner.status === 'active' ? 'disabled' : 'active';
    showToast(`Banner #${banner.priority} status set to ${banner.status.toUpperCase()}`, '🖼️');
    renderBannersTable();
  };

  // --- 14. Tournament Management Engine ---
  window.renderTournamentsGrid = function () {
    const container = document.getElementById('tournaments-grid-container');
    if (!container) return;
    container.innerHTML = STATE.tournaments.map(t => `
      <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:16px; padding:18px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="status-pill-badge ${t.status === 'live' ? 'approved' : (t.status === 'paused' ? 'pending' : (t.status === 'cancelled' ? 'rejected' : 'active'))}">
            ${t.status === 'live' ? '● LIVE REGISTRATION' : (t.status === 'paused' ? '⏸️ PAUSED' : (t.status === 'cancelled' ? '✕ CANCELLED' : '⏳ UPCOMING'))}
          </span>
          <strong style="color:#f59e0b; font-size:16px;">₹${t.prizePool.toLocaleString()} POOL</strong>
        </div>
        <h3 style="font-size:15px; font-weight:900; color:#0f172a; margin:10px 0 4px;">${t.name}</h3>
        <p style="font-size:11px; color:#64748b;">Game: ${t.game} • ${t.bracket}</p>
        <div style="background:#f8fbfe; border-radius:10px; padding:8px; margin:10px 0; font-size:11px; display:flex; justify-content:space-between;">
          <span>Entry: <strong>₹${t.entryFee}</strong></span>
          <span>Slots: <strong>${t.slots} / ${t.maxSlots}</strong></span>
          <span>Starts: <strong>${t.startTime}</strong></span>
        </div>
        <div style="display:flex; gap:6px;">
          ${t.status !== 'cancelled' ? `
            <button class="btn-table-action" style="flex:1;" onclick="openEditTournamentModal('${t.id}')">EDIT ✏️</button>
            <button class="btn-table-action" style="flex:1;" onclick="togglePauseTournament('${t.id}')">
              ${t.status === 'paused' ? 'RESUME ▶' : 'PAUSE ⏸️'}
            </button>
            <button class="btn-table-action danger" style="flex:1;" onclick="cancelTournament('${t.id}')">CANCEL</button>
          ` : `
            <button class="btn-table-action" style="flex:1; opacity:0.6;" disabled>REFUNDED &amp; CLOSED</button>
          `}
        </div>
      </div>
    `).join('');
  };

  window.openCreateTournamentModal = function () {
    playAdminSound('click');
    const modal = document.getElementById('modal-tournament-form');
    if (!modal) return;
    document.getElementById('trn-form-modal-title').textContent = '➕ Create Mega Daily Tournament';
    document.getElementById('trn-edit-id').value = '';
    document.getElementById('trn-name-input').value = '';
    document.getElementById('trn-game-select').value = 'Ludo Classic 1v1';
    document.getElementById('trn-fee-input').value = '50';
    document.getElementById('trn-pool-input').value = '25000';
    document.getElementById('trn-slots-input').value = '500';
    document.getElementById('trn-time-input').value = '09:00 PM';
    modal.classList.add('show');
  };

  window.openEditTournamentModal = function (trnId) {
    playAdminSound('click');
    const trn = STATE.tournaments.find(t => t.id === trnId);
    if (!trn) return;
    const modal = document.getElementById('modal-tournament-form');
    if (!modal) return;
    document.getElementById('trn-form-modal-title').textContent = `✏️ Edit Tournament: ${trn.name}`;
    document.getElementById('trn-edit-id').value = trn.id;
    document.getElementById('trn-name-input').value = trn.name;
    document.getElementById('trn-game-select').value = trn.game;
    document.getElementById('trn-fee-input').value = trn.entryFee;
    document.getElementById('trn-pool-input').value = trn.prizePool;
    document.getElementById('trn-slots-input').value = trn.maxSlots;
    document.getElementById('trn-time-input').value = trn.startTime;
    modal.classList.add('show');
  };

  window.closeTournamentModal = function () {
    const modal = document.getElementById('modal-tournament-form');
    if (modal) modal.classList.remove('show');
  };

  window.saveTournamentForm = function (e) {
    if (e) e.preventDefault();
    playAdminSound('success');
    const trnId = document.getElementById('trn-edit-id').value;
    const name = document.getElementById('trn-name-input').value.trim();
    const game = document.getElementById('trn-game-select').value;
    const entryFee = parseFloat(document.getElementById('trn-fee-input').value) || 10;
    const prizePool = parseFloat(document.getElementById('trn-pool-input').value) || 1000;
    const maxSlots = parseInt(document.getElementById('trn-slots-input').value, 10) || 100;
    const startTime = document.getElementById('trn-time-input').value.trim() || '08:00 PM';

    if (!name) {
      showToast('Please enter tournament title', '⚠️');
      return;
    }

    if (trnId) {
      const trn = STATE.tournaments.find(t => t.id === trnId);
      if (trn) {
        trn.name = name;
        trn.game = game;
        trn.entryFee = entryFee;
        trn.prizePool = prizePool;
        trn.maxSlots = maxSlots;
        trn.startTime = startTime;
        showToast('Tournament parameters updated!', '🏆');
      }
    } else {
      const newId = `TRN-${STATE.tournaments.length + 101}`;
      STATE.tournaments.push({
        id: newId,
        name,
        game,
        bracket: 'Knockout Bracket',
        entryFee,
        prizePool,
        slots: 0,
        maxSlots,
        startTime,
        status: 'live'
      });
      showToast(`Tournament "${name}" published!`, '🎉');
    }

    STATE.auditLogs.unshift({
      admin: 'Super Admin',
      role: 'Game Operator',
      action: trnId ? 'Tournament Modified' : 'Tournament Created',
      target: name,
      details: `Prize Pool: ₹${prizePool.toLocaleString()} | Fee: ₹${entryFee}`,
      reason: 'Tournament schedule management',
      time: 'Just now',
      ip: '192.168.1.1'
    });

    closeTournamentModal();
    renderTournamentsGrid();
    renderAuditLogsTable();
  };

  window.togglePauseTournament = function (trnId) {
    playAdminSound('click');
    const trn = STATE.tournaments.find(t => t.id === trnId);
    if (!trn) return;
    trn.status = trn.status === 'paused' ? 'live' : 'paused';
    showToast(`Tournament is now ${trn.status.toUpperCase()}`, '⏸️');
    renderTournamentsGrid();
  };

  window.cancelTournament = function (trnId) {
    playAdminSound('click');
    const trn = STATE.tournaments.find(t => t.id === trnId);
    if (!trn) return;
    if (confirm(`Are you sure you want to cancel "${trn.name}"? All ${trn.slots} registered players will receive a 100% wallet refund immediately.`)) {
      playAdminSound('success');
      trn.status = 'cancelled';
      showToast(`Tournament cancelled. 100% fees refunded to ${trn.slots} players.`, '💰');

      STATE.auditLogs.unshift({
        admin: 'Super Admin',
        role: 'Super Administrator',
        action: 'Tournament Cancelled & Refunded',
        target: trn.name,
        details: `${trn.slots} Players Refunded ₹${(trn.slots * trn.entryFee).toLocaleString()}`,
        reason: 'Emergency tournament cancellation',
        time: 'Just now',
        ip: '192.168.1.1'
      });

      renderTournamentsGrid();
      renderAuditLogsTable();
    }
  };

  // --- 15. Emergency Maintenance Switch ---
  window.toggleEmergencyMaintenance = function (checkbox) {
    playAdminSound('click');
    STATE.isMaintenance = checkbox.checked;
    showToast(
      STATE.isMaintenance ? '🚨 Platform is now locked in MAINTENANCE MODE' : '🛡️ Maintenance mode disabled. Platform LIVE', 
      STATE.isMaintenance ? '🚨' : '✅'
    );
  };

  // --- 16. Mobile Sidebar Controller ---
  window.toggleMobileSidebar = function () {
    playAdminSound('click');
    const sidebar = document.getElementById('admin-sidebar');
    let backdrop = document.getElementById('admin-sidebar-backdrop');
    
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'admin-sidebar-backdrop';
      backdrop.className = 'admin-sidebar-backdrop';
      backdrop.onclick = window.toggleMobileSidebar;
      document.body.appendChild(backdrop);
    }

    if (sidebar) {
      sidebar.classList.toggle('open');
      if (sidebar.classList.contains('open')) {
        backdrop.classList.add('active');
      } else {
        backdrop.classList.remove('active');
      }
    }
  };

  // --- 17. Initial Load & Event Listeners ---
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Enterprise Super Admin Suite Initialized.');
    
    // Live Search on Players Table
    const searchInput = document.getElementById('player-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        STATE.playerSearch = e.target.value.trim();
        renderPlayersTable();
      });
    }

    // Attach mobile sidebar toggle
    document.querySelectorAll('.btn-sidebar-toggle').forEach(btn => {
      btn.onclick = window.toggleMobileSidebar;
    });

    // Auto-render active page tables
    renderPlayersTable();
    renderDepositsTable();
    renderWithdrawalsTable();
    renderKYCTable();
    renderKYCHistoryTable();
    renderSupportTable();
    renderAuditLogsTable();
    renderEmployeesTable();
    renderBannersTable();
    renderTournamentsGrid();
  });

})();
