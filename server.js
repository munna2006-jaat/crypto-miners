const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure upload & data directories (supports Render Persistent Disks via DATA_DIR / UPLOADS_DIR)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'db.json');

const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Serve uploads from uploadDir (works for both local public/uploads and persistent disk mounts)
app.use('/uploads', express.static(uploadDir));

// Multer storage with 15MB file size limit & mime-type security to prevent disk overflow
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, (file.fieldname || 'qr') + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // Max 15MB per upload
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|jfif|bmp/i;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype) || (file.mimetype && file.mimetype.startsWith('image/'));
    if (ext || mime) {
      return cb(null, true);
    }
    cb(new Error("Only image files (JPG, PNG, WEBP, BMP) are allowed!"));
  }
});

const defaultDB = {
  admin: {
    username: "Crypto_SuperAdmin",
    password: "Crypto@2026#SecureAdmin!"
  },
  settings: {
    platform_name: "CryptoMiners VIP",
    app_announcement: "⚡ Welcome to CryptoMiners Global Cloud Hashrate! Real-time ASIC mining yields credited every 24H. Instant withdrawals in INR & USDT! 3-level VIP commission up to 40%! Earn passive crypto wealth today!",
    min_recharge: 499,
    min_withdraw: 200,
    withdrawal_fee_percent: 5,
    withdrawal_time: "08:00 - 22:00 (Daily)",
    telegram_channel: "https://t.me/VIJAY_SIR_NO1",
    telegram_enabled: true,
    whatsapp_support: "+919876543210",
    whatsapp_enabled: true,
    upi_id: "cryptominers@okaxis",
    merchant_name: "CRYPTOMINERS CLOUD TECHNOLOGIES PVT LTD",
    usdt_trc20_address: "TXjK9zFw8q2LmN4vP1aB3cE5gH7jK9mN2p",
    usdt_bep20_address: "0x71C865882B32847B0d0c35471647F4f98BE1111",
    btc_address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    qr_image: "/images/logo.svg",
    qr_rotation_index: 0,
    qr_codes: [
      {
        id: "qr_1",
        image: "/images/logo.svg",
        title: "Channel 1 (Primary UPI FastPay)",
        upi_id: "cryptominers@okaxis",
        crypto_address: "TXjK9zFw8q2LmN4vP1aB3cE5gH7jK9mN2p",
        crypto_network: "USDT TRC-20",
        status: "active",
        created_at: "2026-11-05T00:00:00.000Z",
        hits: 0
      },
      {
        id: "qr_2",
        image: "/images/usdt.svg",
        title: "Channel 2 (USDT TRC20 Direct)",
        upi_id: "cryptominers@okaxis",
        crypto_address: "TXjK9zFw8q2LmN4vP1aB3cE5gH7jK9mN2p",
        crypto_network: "USDT TRC-20",
        status: "active",
        created_at: "2026-11-05T00:00:00.000Z",
        hits: 0
      },
      {
        id: "qr_3",
        image: "/images/btc.svg",
        title: "Channel 3 (PhonePe & GPay Instant)",
        upi_id: "cryptominers@okaxis",
        crypto_address: "0x71C865882B32847B0d0c35471647F4f98BE1111",
        crypto_network: "USDT BEP-20",
        status: "active",
        created_at: "2026-11-05T00:00:00.000Z",
        hits: 0
      }
    ]
  },
  plans: [
    {
      id: "plan_500",
      category: "normal",
      title: "BTC Starter Flash Rig (45 Min)",
      coin: "BTC",
      hashrate: "150 TH/s",
      price: 500,
      daily_income: 4500,
      total_income: 4500,
      cycle_days: 0,
      duration_minutes: 45,
      duration_label: "45 Min",
      limit: 10,
      image: "/images/btc.svg",
      status: "active"
    },
    {
      id: "plan_1000",
      category: "normal",
      title: "ETH High-Speed Staking Node (45 Min)",
      coin: "ETH",
      hashrate: "450 MH/s",
      price: 1000,
      daily_income: 8000,
      total_income: 8000,
      cycle_days: 0,
      duration_minutes: 45,
      duration_label: "45 Min",
      limit: 10,
      image: "/images/eth.svg",
      status: "active"
    },
    {
      id: "plan_3000",
      category: "normal",
      title: "USDT Turbo Quantum Hive (45 Min)",
      coin: "USDT",
      hashrate: "980 MH/s",
      price: 3000,
      daily_income: 15000,
      total_income: 15000,
      cycle_days: 0,
      duration_minutes: 45,
      duration_label: "45 Min",
      limit: 10,
      image: "/images/usdt.svg",
      status: "active"
    },
    {
      id: "plan_5000",
      category: "normal",
      title: "SOL Rapid Validator Cluster (45 Min)",
      coin: "SOL",
      hashrate: "3.2 GH/s",
      price: 5000,
      daily_income: 25000,
      total_income: 25000,
      cycle_days: 0,
      duration_minutes: 45,
      duration_label: "45 Min",
      limit: 10,
      image: "/images/sol.svg",
      status: "active"
    },
    {
      id: "plan_10000",
      category: "normal",
      title: "BNB Lightning Quantum Rig (45 Min)",
      coin: "BNB",
      hashrate: "7.5 GH/s",
      price: 10000,
      daily_income: 50000,
      total_income: 50000,
      cycle_days: 0,
      duration_minutes: 45,
      duration_label: "45 Min",
      limit: 10,
      image: "/images/btc.svg",
      status: "active"
    },
    {
      id: "plan_20000",
      category: "vip",
      title: "Antminer S21 Pro Hydro Ultra (45 Min)",
      coin: "BTC",
      hashrate: "420 TH/s",
      price: 20000,
      daily_income: 110000,
      total_income: 110000,
      cycle_days: 0,
      duration_minutes: 45,
      duration_label: "45 Min",
      limit: 10,
      image: "/images/miner_rig.svg",
      status: "active"
    },
    {
      id: "plan_30000",
      category: "vip",
      title: "Ethereum Enterprise Staking Hive (45 Min)",
      coin: "ETH",
      hashrate: "1.2 GH/s",
      price: 30000,
      daily_income: 160000,
      total_income: 160000,
      cycle_days: 0,
      duration_minutes: 45,
      duration_label: "45 Min",
      limit: 10,
      image: "/images/eth.svg",
      status: "active"
    },
    {
      id: "plan_40000",
      category: "vip",
      title: "Solana Quantum Supercluster (45 Min)",
      coin: "SOL",
      hashrate: "12.5 GH/s",
      price: 40000,
      daily_income: 210000,
      total_income: 210000,
      cycle_days: 0,
      duration_minutes: 45,
      duration_label: "45 Min",
      limit: 10,
      image: "/images/sol.svg",
      status: "active"
    },
    {
      id: "plan_50000",
      category: "vip",
      title: "Apex AI Genesis Supercomputing Hive (45 Min)",
      coin: "BTC",
      hashrate: "2.8 PH/s",
      price: 50000,
      daily_income: 260000,
      total_income: 260000,
      cycle_days: 0,
      duration_minutes: 45,
      duration_label: "45 Min",
      limit: 10,
      image: "/images/logo.svg",
      status: "active"
    }
  ],
  users: [
    {
      id: "u_demo",
      phone: "9876543210",
      name: "Rahul Verma",
      password: "password123",
      ref_code: "598823",
      invited_by: null,
      balance: 1440.00,
      total_income: 8708.00,
      total_recharge: 720.00,
      total_withdraw: 0.00,
      bank_account: {
        account_holder: "Rahul Verma",
        bank_name: "State Bank of India",
        account_number: "987654321098",
        ifsc: "SBIN0001234",
        upi_id: "rahul@upi"
      },
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    }
  ],
  user_plans: [
    {
      id: "up_1",
      user_id: "u_demo",
      plan_id: "plan_offer",
      plan_title: "Offer Plan- Daily Withdrawal",
      price: 720,
      daily_income: 4354,
      total_income: 8708,
      cycle_days: 2,
      days_passed: 1,
      total_claimed: 4354,
      last_claim_date: new Date().toISOString().split('T')[0],
      purchase_date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      status: "running"
    }
  ],
  recharges: [
    {
      id: "rc_101",
      user_id: "u_demo",
      user_name: "Rahul Verma",
      user_phone: "9876543210",
      amount: 720,
      utr: "429188294821",
      screenshot: "/images/logo.svg",
      status: "approved",
      date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      note: "Auto-verified by admin"
    },
    {
      id: "rc_102",
      user_id: "u_demo",
      user_name: "Rahul Verma",
      user_phone: "9876543210",
      amount: 285,
      utr: "518392019482",
      screenshot: "/images/logo.svg",
      status: "pending",
      date: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      note: "Client submitted UTR"
    }
  ],
  withdrawals: [
    {
      id: "wd_201",
      user_id: "u_demo",
      user_name: "Rahul Verma",
      user_phone: "9876543210",
      amount: 500,
      fee: 50,
      final_amount: 450,
      bank_account: {
        account_holder: "Rahul Verma",
        bank_name: "State Bank of India",
        account_number: "987654321098",
        ifsc: "SBIN0001234",
        upi_id: "rahul@upi"
      },
      status: "pending",
      date: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    }
  ],
  spins: []
};

function ensureQrCodes(db) {
  if (!db.settings) db.settings = {};
  if (!Array.isArray(db.settings.qr_codes) || db.settings.qr_codes.length === 0) {
    db.settings.qr_codes = [
      {
        id: "qr_1",
        image: db.settings.qr_image || "/uploads/qr_image_file-1792393880255-893536610.png",
        title: "QR Channel 1 (Primary VIP)",
        upi_id: db.settings.upi_id || "cryptominers@okaxis",
        status: "active",
        created_at: new Date().toISOString(),
        hits: 0
      },
      {
        id: "qr_2",
        image: "/uploads/qr_image_file-1792392053755-797022740.png",
        title: "QR Channel 2 (FastPay PhonePe)",
        upi_id: db.settings.upi_id || "cryptominers@okaxis",
        status: "active",
        created_at: new Date().toISOString(),
        hits: 0
      },
      {
        id: "qr_3",
        image: "/uploads/qr_image_file-1792393734117-426912828.jpg",
        title: "QR Channel 3 (Instant GPay)",
        upi_id: db.settings.upi_id || "cryptominers@okaxis",
        status: "active",
        created_at: new Date().toISOString(),
        hits: 0
      },
      {
        id: "qr_4",
        image: "/images/logo.svg",
        title: "QR Channel 4 (Paytm Gateway)",
        upi_id: db.settings.upi_id || "cryptominers@okaxis",
        status: "active",
        created_at: new Date().toISOString(),
        hits: 0
      },
      {
        id: "qr_5",
        image: "/uploads/qr_backup_5.jpg",
        title: "QR Channel 5 (BHIM / UPI Ultra)",
        upi_id: db.settings.upi_id || "cryptominers@okaxis",
        status: "active",
        created_at: new Date().toISOString(),
        hits: 0
      }
    ];
  }
  if (typeof db.settings.qr_rotation_index !== 'number') {
    db.settings.qr_rotation_index = 0;
  }
}

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(defaultDB));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    ensureQrCodes(parsed);
    return parsed;
  } catch (err) {
    console.error("Error reading DB:", err);
    return defaultDB;
  }
}

function writeDB(data) {
  try {
    // Database overflow guard: keep memory and file size lean
    if (Array.isArray(data.recharges) && data.recharges.length > 2500) {
      data.recharges = data.recharges.slice(0, 2500);
    }
    if (Array.isArray(data.withdrawals) && data.withdrawals.length > 2500) {
      data.withdrawals = data.withdrawals.slice(0, 2500);
    }
    if (Array.isArray(data.spins) && data.spins.length > 1000) {
      data.spins = data.spins.slice(0, 1000);
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error writing DB:", err);
    return false;
  }
}

// Ensure DB is initialized
readDB();

// ----------------- CLIENT AUTH & USER APIS -----------------

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, phone, password, confirm_password, ref_code } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ success: false, message: "Please fill all required fields" });
  }
  if (confirm_password && password !== confirm_password) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }
  if (phone.length < 10) {
    return res.status(400).json({ success: false, message: "Please enter a valid 10-digit mobile number" });
  }

  const db = readDB();
  const existing = db.users.find(u => u.phone === phone.trim());
  if (existing) {
    return res.status(400).json({ success: false, message: "Mobile number is already registered" });
  }

  // Generate 6 digit invite code
  const newRefCode = Math.floor(100000 + Math.random() * 900000).toString();
  const newUser = {
    id: "u_" + Date.now(),
    name: name.trim(),
    phone: phone.trim(),
    password: password.trim(),
    ref_code: newRefCode,
    invited_by: ref_code ? ref_code.trim() : null,
    balance: 0.00,
    total_income: 0.00,
    total_recharge: 0.00,
    total_withdraw: 0.00,
    bank_account: null,
    created_at: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  return res.json({
    success: true,
    message: "Registration successful!",
    user: {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      ref_code: newUser.ref_code,
      balance: newUser.balance
    }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "Mobile number and password required" });
  }

  const db = readDB();
  const user = db.users.find(u => u.phone === phone.trim() && u.password === password.trim());
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid mobile number or password" });
  }

  if (user.status === 'banned') {
    return res.status(403).json({ success: false, message: "Your account has been suspended by administrator. Please contact support." });
  }

  return res.json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      ref_code: user.ref_code,
      balance: user.balance,
      status: user.status || 'active'
    }
  });
});

// Get User Profile
app.get('/api/user/profile', (req, res) => {
  const phone = req.query.phone;
  const db = readDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Count active plans
  const activePlans = db.user_plans.filter(p => p.user_id === user.id && p.status === 'running');

  // Count team
  const level1 = db.users.filter(u => u.invited_by === user.ref_code);
  const l1Codes = level1.map(u => u.ref_code);
  const level2 = db.users.filter(u => l1Codes.includes(u.invited_by));
  const l2Codes = level2.map(u => u.ref_code);
  const level3 = db.users.filter(u => l2Codes.includes(u.invited_by));

  const teamCount = level1.length + level2.length + level3.length;

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      ref_code: user.ref_code,
      balance: Number(user.balance || 0).toFixed(2),
      total_income: Number(user.total_income || 0).toFixed(2),
      total_recharge: Number(user.total_recharge || 0).toFixed(2),
      total_withdraw: Number(user.total_withdraw || 0).toFixed(2),
      gst_percent: user.gst_percent !== undefined && user.gst_percent !== null ? Number(user.gst_percent) : 0,
      commission_percent: user.commission_percent !== undefined && user.commission_percent !== null ? Number(user.commission_percent) : (db.settings.withdrawal_fee_percent || 10),
      custom_tax_name: user.custom_tax_name || "Withdrawal Tax",
      custom_tax_type: user.custom_tax_type || "percent",
      custom_tax_value: user.custom_tax_value !== undefined && user.custom_tax_value !== null ? Number(user.custom_tax_value) : 0,
      withdrawal_notice: user.withdrawal_notice || "",
      bank_account: user.bank_account,
      active_plans_count: activePlans.length,
      team_count: teamCount
    }
  });
});

// Save or Update Bank / UPI
app.post('/api/user/bank', (req, res) => {
  const { phone, account_holder, bank_name, account_number, ifsc, upi_id } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.bank_account = {
    account_holder: account_holder || user.name,
    bank_name: bank_name || "Bank",
    account_number: account_number || "",
    ifsc: ifsc || "",
    upi_id: upi_id || ""
  };

  writeDB(db);
  return res.json({ success: true, message: "Bank & UPI details saved successfully", bank_account: user.bank_account });
});

// ----------------- PLANS & INVESTMENTS -----------------

// Get all active plans
app.get('/api/plans', (req, res) => {
  const db = readDB();
  const plans = db.plans.filter(p => p.status === 'active');
  return res.json({ success: true, plans });
});

// Buy a plan
app.post('/api/plans/buy', (req, res) => {
  const { phone, plan_id } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const plan = db.plans.find(p => p.id === plan_id && p.status === 'active');
  if (!plan) {
    return res.status(404).json({ success: false, message: "Plan not found" });
  }

  // Check user active purchases of this plan for limit
  const userPurchases = db.user_plans.filter(up => up.user_id === user.id && up.plan_id === plan.id);
  if (userPurchases.length >= (plan.limit || 10)) {
    return res.status(400).json({ success: false, message: `Purchase limit reached for this plan (Max: ${plan.limit})` });
  }

  if (Number(user.balance) < Number(plan.price)) {
    return res.status(400).json({
      success: false,
      message: `Insufficient balance! You need ₹${plan.price}, your balance is ₹${Number(user.balance).toFixed(2)}. Please recharge first!`
    });
  }

  // Deduct balance
  user.balance = Number(user.balance) - Number(plan.price);

  // Create user plan (45 Minutes duration)
  const now = Date.now();
  const durationMin = plan.duration_minutes || 45;
  const userPlan = {
    id: "up_" + now,
    user_id: user.id,
    plan_id: plan.id,
    plan_title: plan.title,
    coin: plan.coin || "BTC",
    hashrate: plan.hashrate || "150 TH/s",
    price: plan.price,
    daily_income: plan.total_income,
    total_income: plan.total_income,
    duration_minutes: durationMin,
    duration_label: plan.duration_label || "45 Min",
    cycle_days: 0,
    total_claimed: 0,
    purchased_at: now,
    expires_at: now + durationMin * 60 * 1000,
    purchase_date: new Date().toISOString(),
    status: "running"
  };

  db.user_plans.push(userPlan);

  // Distribute Referral Commission: Level 1 (40%), Level 2 (3%), Level 3 (1%)
  if (user.invited_by) {
    const l1User = db.users.find(u => u.ref_code === user.invited_by);
    if (l1User) {
      const comm1 = Number((plan.price * 0.40).toFixed(2));
      l1User.balance = (Number(l1User.balance) + comm1);
      l1User.total_income = (Number(l1User.total_income || 0) + comm1);

      if (l1User.invited_by) {
        const l2User = db.users.find(u => u.ref_code === l1User.invited_by);
        if (l2User) {
          const comm2 = Number((plan.price * 0.03).toFixed(2));
          l2User.balance = (Number(l2User.balance) + comm2);
          l2User.total_income = (Number(l2User.total_income || 0) + comm2);

          if (l2User.invited_by) {
            const l3User = db.users.find(u => u.ref_code === l2User.invited_by);
            if (l3User) {
              const comm3 = Number((plan.price * 0.01).toFixed(2));
              l3User.balance = (Number(l3User.balance) + comm3);
              l3User.total_income = (Number(l3User.total_income || 0) + comm3);
            }
          }
        }
      }
    }
  }

  writeDB(db);

  return res.json({
    success: true,
    message: `Mining Rig "${plan.title}" deployed successfully! Yield of ₹${plan.total_income.toLocaleString('en-IN')} will be ready in 45 minutes!`,
    balance: Number(user.balance).toFixed(2),
    user_plan: userPlan
  });
});

// Get user's purchased plans & unclaimed profits (45 Min cycle)
app.get('/api/user/plans', (req, res) => {
  const phone = req.query.phone;
  const db = readDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const myPlans = db.user_plans.filter(p => p.user_id === user.id);
  const now = Date.now();

  let totalReadyToClaim = 0;
  const formattedPlans = myPlans.map(p => {
    const durationMin = p.duration_minutes || 45;
    const durationMs = durationMin * 60 * 1000;
    const purchasedAt = p.purchased_at || (p.purchase_date ? new Date(p.purchase_date).getTime() : now);
    const expiresAt = p.expires_at || (purchasedAt + durationMs);
    const remainingMs = Math.max(0, expiresAt - now);
    const remainingSec = Math.floor(remainingMs / 1000);
    const isCompleted = p.status === 'completed';
    const isReady = p.status === 'running' && remainingMs <= 0;

    if (isReady) {
      totalReadyToClaim += Number(p.total_income || 0);
    }

    return {
      ...p,
      duration_minutes: durationMin,
      duration_label: p.duration_label || "45 Min",
      remaining_seconds: remainingSec,
      progress_percent: isCompleted ? 100 : Math.min(100, Math.floor(((now - purchasedAt) / durationMs) * 100)),
      ready_to_claim: isReady
    };
  });

  return res.json({
    success: true,
    plans: formattedPlans,
    totalReadyToClaim: totalReadyToClaim,
    hasReadyPlans: totalReadyToClaim > 0
  });
});

// Claim Mining Yield (45 Min cycle)
app.post('/api/user/claim-income', (req, res) => {
  const { phone } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const now = Date.now();
  let claimedSum = 0;

  db.user_plans.forEach(p => {
    if (p.user_id === user.id && p.status === 'running') {
      const durationMin = p.duration_minutes || 45;
      const durationMs = durationMin * 60 * 1000;
      const purchasedAt = p.purchased_at || (p.purchase_date ? new Date(p.purchase_date).getTime() : now);
      const expiresAt = p.expires_at || (purchasedAt + durationMs);

      // If 45 minutes have elapsed
      if (now >= expiresAt) {
        const yieldAmt = Number(p.total_income || 0);
        claimedSum += yieldAmt;
        p.total_claimed = (p.total_claimed || 0) + yieldAmt;
        p.status = 'completed';
        p.claimed_at = new Date().toISOString();
      }
    }
  });

  if (claimedSum <= 0) {
    return res.status(400).json({
      success: false,
      message: "Mining rig is currently hashing! Please wait for the 45-minute cycle to finish."
    });
  }

  user.balance = Number(user.balance) + claimedSum;
  user.total_income = Number(user.total_income || 0) + claimedSum;

  writeDB(db);

  return res.json({
    success: true,
    message: `🎉 Successfully harvested ₹${claimedSum.toLocaleString('en-IN')} cloud mining profit into your wallet!`,
    claimedAmount: claimedSum,
    balance: Number(user.balance).toFixed(2),
    total_income: Number(user.total_income).toFixed(2)
  });
});

// ----------------- PAYMENT CONFIG & RECHARGE (DEPOSIT) -----------------

// Get Payment Config (Admin QR, UPI ID, etc. with multi-QR rotation across different users)
app.get('/api/payment-config', (req, res) => {
  const db = readDB();
  ensureQrCodes(db);

  const activeQrs = (db.settings.qr_codes || []).filter(q => q.status === 'active');
  let selectedQr = null;

  if (activeQrs.length > 0) {
    // If client requested specific QR by ID
    if (req.query.qr_id) {
      selectedQr = activeQrs.find(q => q.id === req.query.qr_id);
    }
    // If client requested NEXT QR because current payment failed / refresh button clicked
    if (!selectedQr && req.query.exclude_id) {
      const curIdx = activeQrs.findIndex(q => q.id === req.query.exclude_id);
      if (curIdx !== -1) {
        selectedQr = activeQrs[(curIdx + 1) % activeQrs.length];
      }
    }
    // Otherwise rotate across users
    if (!selectedQr) {
      let rotIdx = db.settings.qr_rotation_index || 0;
      if (rotIdx >= activeQrs.length) rotIdx = 0;
      selectedQr = activeQrs[rotIdx];
      db.settings.qr_rotation_index = (rotIdx + 1) % activeQrs.length;
    }

    if (selectedQr) {
      selectedQr.hits = (selectedQr.hits || 0) + 1;
      writeDB(db);
    }
  }

  if (!selectedQr) {
    selectedQr = {
      id: 'qr_default',
      image: db.settings.qr_image || '/images/logo.svg',
      title: 'Primary UPI QR',
      upi_id: db.settings.upi_id || 'cryptominers@okaxis',
      status: 'active'
    };
  }

  const currentIdx = activeQrs.findIndex(q => q.id === selectedQr.id);
  const activeQrPayload = {
    id: selectedQr.id,
    image: selectedQr.image,
    title: selectedQr.title,
    upi_id: selectedQr.upi_id || db.settings.upi_id || 'cryptominers@okaxis',
    index: currentIdx !== -1 ? currentIdx + 1 : 1,
    total: activeQrs.length || 1
  };

  const effectiveSettings = {
    ...db.settings,
    qr_image: activeQrPayload.image,
    upi_id: activeQrPayload.upi_id
  };

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return res.json({
    success: true,
    settings: effectiveSettings,
    config: effectiveSettings,
    active_qr: activeQrPayload,
    all_active_qrs: activeQrs.map((q, idx) => ({
      id: q.id,
      image: q.image,
      title: q.title,
      upi_id: q.upi_id || db.settings.upi_id || 'cryptominers@okaxis',
      index: idx + 1,
      total: activeQrs.length
    })),
    total_active_qrs: activeQrs.length
  });
});

// Dedicated QR Refresh endpoint (when user clicks 'Refresh QR' if payment fails or bank is busy)
app.get('/api/payment-config/refresh', (req, res) => {
  const db = readDB();
  ensureQrCodes(db);

  const activeQrs = (db.settings.qr_codes || []).filter(q => q.status === 'active');
  if (activeQrs.length === 0) {
    return res.json({
      success: true,
      active_qr: {
        id: 'qr_default',
        image: db.settings.qr_image || '/images/logo.svg',
        title: 'Primary UPI QR',
        upi_id: db.settings.upi_id || 'cryptominers@okaxis',
        index: 1,
        total: 1
      }
    });
  }

  let nextQr = null;
  if (req.query.current_id) {
    const curIdx = activeQrs.findIndex(q => q.id === req.query.current_id);
    if (curIdx !== -1) {
      nextQr = activeQrs[(curIdx + 1) % activeQrs.length];
    }
  }
  if (!nextQr) {
    let rotIdx = db.settings.qr_rotation_index || 0;
    if (rotIdx >= activeQrs.length) rotIdx = 0;
    nextQr = activeQrs[rotIdx];
    db.settings.qr_rotation_index = (rotIdx + 1) % activeQrs.length;
  }

  nextQr.hits = (nextQr.hits || 0) + 1;
  writeDB(db);

  const curIdx = activeQrs.findIndex(q => q.id === nextQr.id);
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return res.json({
    success: true,
    message: "New QR loaded successfully",
    active_qr: {
      id: nextQr.id,
      image: nextQr.image,
      title: nextQr.title,
      upi_id: nextQr.upi_id || db.settings.upi_id || 'cryptominers@okaxis',
      index: curIdx !== -1 ? curIdx + 1 : 1,
      total: activeQrs.length
    }
  });
});

// Submit Recharge Request (Manual payment verification via UTR + QR)
app.post('/api/recharge', upload.single('screenshot'), (req, res) => {
  const { phone, amount, utr, qr_id, qr_image } = req.body;
  if (!phone || !amount || !utr) {
    return res.status(400).json({ success: false, message: "Please provide phone number, recharge amount, and 12-digit UTR/Ref number" });
  }

  const cleanUtr = utr.trim();
  if (cleanUtr.length < 8) {
    return res.status(400).json({ success: false, message: "Please enter a valid 12-digit UPI Reference / UTR Number" });
  }

  const numAmount = parseFloat(amount);
  const db = readDB();
  const minRecharge = db.settings.min_recharge || 285;
  if (numAmount < minRecharge) {
    return res.status(400).json({ success: false, message: `Minimum recharge amount is ₹${minRecharge}` });
  }

  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check duplicate UTR
  const existingUtr = db.recharges.find(r => r.utr === cleanUtr && r.status !== 'rejected');
  if (existingUtr) {
    return res.status(400).json({ success: false, message: "This UTR / Reference number has already been submitted!" });
  }

  const screenshotPath = req.file ? `/uploads/${req.file.filename}` : (qr_image || db.settings.qr_image);

  const newRecharge = {
    id: "rc_" + Date.now(),
    user_id: user.id,
    user_name: user.name,
    user_phone: user.phone,
    amount: numAmount,
    utr: cleanUtr,
    qr_id: qr_id || null,
    screenshot: screenshotPath,
    status: "pending",
    date: new Date().toISOString(),
    note: "Submitted by client, awaiting admin verification"
  };

  db.recharges.unshift(newRecharge);
  writeDB(db);

  return res.json({
    success: true,
    message: "Payment receipt submitted successfully! Admin will verify your UTR and credit your balance within 5-15 minutes.",
    recharge: newRecharge
  });
});

// Get User Unified History (Recharges & Withdrawals)
app.get('/api/user/history', (req, res) => {
  const phone = req.query.phone;
  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number required" });
  }
  const db = readDB();
  const cleanPhone = String(phone).trim();
  const user = db.users.find(u => String(u.phone).trim() === cleanPhone || String(u.id) === cleanPhone);

  const recharges = db.recharges.filter(r => 
    (user && r.user_id === user.id) || 
    String(r.user_phone).trim() === cleanPhone || 
    (user && String(r.user_phone).trim() === String(user.phone).trim())
  );

  const withdrawals = db.withdrawals.filter(w => 
    (user && w.user_id === user.id) || 
    String(w.user_phone).trim() === cleanPhone || 
    (user && String(w.user_phone).trim() === String(user.phone).trim())
  );

  return res.json({
    success: true,
    user: user ? { id: user.id, name: user.name, phone: user.phone, balance: user.balance } : null,
    recharges,
    withdrawals,
    history: { recharges, withdrawals }
  });
});

// Get User Recharge History
app.get('/api/recharge/history', (req, res) => {
  const phone = req.query.phone;
  const db = readDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const history = db.recharges.filter(r => r.user_id === user.id || r.user_phone === user.phone);
  return res.json({ success: true, history, recharges: history });
});

// ----------------- WITHDRAWAL FLOW -----------------

// Submit Withdrawal Request
app.post('/api/withdraw', (req, res) => {
  const { phone, amount, account_holder, bank_name, account_number, ifsc, upi_id } = req.body;
  if (!phone || !amount) {
    return res.status(400).json({ success: false, message: "Phone number and withdrawal amount required" });
  }

  const numAmount = parseFloat(amount);
  const db = readDB();
  const minWithdraw = db.settings.min_withdraw || 200;
  if (numAmount < minWithdraw) {
    return res.status(400).json({ success: false, message: `Minimum withdrawal amount is ₹${minWithdraw}` });
  }

  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (Number(user.balance) < numAmount) {
    return res.status(400).json({
      success: false,
      message: `Insufficient wallet balance! Your available balance is ₹${Number(user.balance).toFixed(2)}`
    });
  }

  const bankDetails = {
    account_holder: account_holder || (user.bank_account && user.bank_account.account_holder) || user.name,
    bank_name: bank_name || (user.bank_account && user.bank_account.bank_name) || "UPI Bank",
    account_number: account_number || (user.bank_account && user.bank_account.account_number) || "",
    ifsc: ifsc || (user.bank_account && user.bank_account.ifsc) || "",
    upi_id: upi_id || (user.bank_account && user.bank_account.upi_id) || ""
  };

  if (!bankDetails.account_number && !bankDetails.upi_id) {
    return res.status(400).json({ success: false, message: "Please provide Bank Account Number or UPI ID for payout" });
  }

  // Deduct balance immediately
  user.balance = Number(user.balance) - numAmount;
  user.bank_account = bankDetails; // save latest bank info

  // Custom User GST Tax, Platform Commission & Custom User Tax (e.g. Withdrawal Tax)
  const gstPercent = (user.gst_percent !== undefined && user.gst_percent !== null) ? Number(user.gst_percent) : (db.settings.gst_percent || 0);
  const commPercent = (user.commission_percent !== undefined && user.commission_percent !== null) ? Number(user.commission_percent) : (db.settings.withdrawal_fee_percent || 10);
  const gstAmount = Number((numAmount * (gstPercent / 100)).toFixed(2));
  const commAmount = Number((numAmount * (commPercent / 100)).toFixed(2));

  // User-specific custom tax (e.g. Withdrawal Tax, TDS, Security Tax in % or Flat ₹)
  const customTaxName = user.custom_tax_name || "Withdrawal Tax";
  const customTaxType = user.custom_tax_type || "percent";
  const customTaxValue = Number(user.custom_tax_value || 0);
  let customTaxAmount = 0;
  if (customTaxValue > 0) {
    if (customTaxType === 'flat') {
      customTaxAmount = Number(customTaxValue.toFixed(2));
    } else {
      customTaxAmount = Number((numAmount * (customTaxValue / 100)).toFixed(2));
    }
  }

  const totalFee = Number((gstAmount + commAmount + customTaxAmount).toFixed(2));
  const finalAmount = Number(Math.max(0, numAmount - totalFee).toFixed(2));

  const newWithdrawal = {
    id: "wd_" + Date.now(),
    user_id: user.id,
    user_name: user.name,
    user_phone: user.phone,
    amount: numAmount,
    gst_percent: gstPercent,
    gst_amount: gstAmount,
    commission_percent: commPercent,
    commission_amount: commAmount,
    custom_tax_name: customTaxName,
    custom_tax_type: customTaxType,
    custom_tax_value: customTaxValue,
    custom_tax_amount: customTaxAmount,
    fee: totalFee,
    final_amount: finalAmount,
    withdrawal_notice: user.withdrawal_notice || "",
    bank_account: bankDetails,
    status: "pending",
    date: new Date().toISOString()
  };

  db.withdrawals.unshift(newWithdrawal);
  writeDB(db);

  return res.json({
    success: true,
    message: `Withdrawal request for ₹${numAmount} submitted! Net payout ₹${finalAmount} (GST Tax: ₹${gstAmount}, Commission: ₹${commAmount}). Admin will process shortly.`,
    balance: Number(user.balance).toFixed(2),
    withdrawal: newWithdrawal
  });
});

// Get User Withdrawal History
app.get('/api/withdraw/history', (req, res) => {
  const phone = req.query.phone;
  const db = readDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const history = db.withdrawals.filter(w => w.user_id === user.id || w.user_phone === user.phone);
  return res.json({ success: true, history, withdrawals: history });
});

// ----------------- TEAM & INVITE STATS -----------------

app.get(['/api/team', '/api/user/team'], (req, res) => {
  const phone = req.query.phone;
  const db = readDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Level 1
  const level1 = db.users.filter(u => u.invited_by === user.ref_code);
  const l1Codes = level1.map(u => u.ref_code);
  const l1Recharge = level1.reduce((sum, u) => sum + Number(u.total_recharge || 0), 0);
  const l1Active = level1.filter(u => Number(u.total_recharge || 0) > 0).length;

  // Level 2
  const level2 = db.users.filter(u => l1Codes.includes(u.invited_by));
  const l2Codes = level2.map(u => u.ref_code);
  const l2Recharge = level2.reduce((sum, u) => sum + Number(u.total_recharge || 0), 0);
  const l2Active = level2.filter(u => Number(u.total_recharge || 0) > 0).length;

  // Level 3
  const level3 = db.users.filter(u => l2Codes.includes(u.invited_by));
  const l3Recharge = level3.reduce((sum, u) => sum + Number(u.total_recharge || 0), 0);
  const l3Active = level3.filter(u => Number(u.total_recharge || 0) > 0).length;

  const totalMembers = level1.length + level2.length + level3.length;
  const totalRecharge = l1Recharge + l2Recharge + l3Recharge;
  const totalWithdraw = [...level1, ...level2, ...level3].reduce((sum, u) => sum + Number(u.total_withdraw || 0), 0);

  const statsObj = {
    total_members: totalMembers,
    totalMembers: totalMembers,
    team_recharge: totalRecharge.toFixed(2),
    totalRecharge: totalRecharge.toFixed(2),
    team_withdraw: totalWithdraw.toFixed(2),
    totalWithdraw: totalWithdraw.toFixed(2),
    lvl1Count: level1.length,
    lvl1Active: l1Active,
    lvl1Recharge: l1Recharge.toFixed(2),
    lvl2Count: level2.length,
    lvl2Active: l2Active,
    lvl2Recharge: l2Recharge.toFixed(2),
    lvl3Count: level3.length,
    lvl3Active: l3Active,
    lvl3Recharge: l3Recharge.toFixed(2),
    levels: [
      { level: 1, rate: "40%", commission: 40, members: level1.length, active: l1Active, recharge: l1Recharge.toFixed(2) },
      { level: 2, rate: "3%", commission: 3, members: level2.length, active: l2Active, recharge: l2Recharge.toFixed(2) },
      { level: 3, rate: "1%", commission: 1, members: level3.length, active: l3Active, recharge: l3Recharge.toFixed(2) }
    ],
    recent_activity: level1.slice(0, 5).map(u => ({
      name: u.name,
      phone: u.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
      date: u.created_at,
      recharge: u.total_recharge
    }))
  };

  return res.json({
    success: true,
    stats: statsObj,
    teamStats: statsObj
  });
});

// Lucky Spin Reward
app.post('/api/spin', (req, res) => {
  const { phone } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Random reward: ₹10, ₹25, ₹50, ₹100, ₹200, ₹500
  const rewards = [10, 25, 50, 100, 20, 15, 30, 200];
  const win = rewards[Math.floor(Math.random() * rewards.length)];

  user.balance = Number(user.balance) + win;
  user.total_income = Number(user.total_income || 0) + win;

  db.spins.push({
    user_id: user.id,
    amount: win,
    date: new Date().toISOString()
  });

  writeDB(db);

  return res.json({
    success: true,
    reward: win,
    message: `Congratulations! You won ₹${win} from the CryptoMiners Lucky Wheel! Added directly to your wallet!`,
    balance: Number(user.balance).toFixed(2)
  });
});

// ----------------- ADMIN PANEL APIS -----------------

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  if (username === db.admin.username && password === db.admin.password) {
    return res.json({ success: true, message: "Admin authenticated successfully", token: "admin_token_auth_98234" });
  }
  return res.status(401).json({ success: false, message: "Invalid Admin username or password" });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  const db = readDB();
  const totalUsers = db.users.length;
  const totalRecharge = db.recharges
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalWithdraw = db.withdrawals
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const pendingRecharges = db.recharges.filter(r => r.status === 'pending').length;
  const pendingWithdrawals = db.withdrawals.filter(w => w.status === 'pending').length;
  const totalPlans = db.plans.length;

  return res.json({
    success: true,
    stats: {
      totalUsers,
      totalRecharge: totalRecharge.toFixed(2),
      totalWithdraw: totalWithdraw.toFixed(2),
      pendingRecharges,
      pendingWithdrawals,
      totalPlans
    }
  });
});

// Admin: Get all recharges
app.get('/api/admin/recharges', (req, res) => {
  const db = readDB();
  return res.json({ success: true, recharges: db.recharges });
});

// Admin: Approve Recharge (credits user balance)
app.post('/api/admin/recharge/:id/approve', (req, res) => {
  const rechargeId = req.params.id;
  const db = readDB();
  const recharge = db.recharges.find(r => r.id === rechargeId);
  if (!recharge) {
    return res.status(404).json({ success: false, message: "Recharge record not found" });
  }

  if (recharge.status === 'approved') {
    return res.status(400).json({ success: false, message: "Recharge is already approved" });
  }

  const user = db.users.find(u => u.id === recharge.user_id || u.phone === recharge.user_phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found for this recharge" });
  }

  // Credit user wallet
  user.balance = Number(user.balance) + Number(recharge.amount);
  user.total_recharge = Number(user.total_recharge || 0) + Number(recharge.amount);

  recharge.status = 'approved';
  recharge.approved_at = new Date().toISOString();

  writeDB(db);

  return res.json({
    success: true,
    message: `Recharge of ₹${recharge.amount} approved! ₹${recharge.amount} added to user ${user.name} (${user.phone})`,
    recharge
  });
});

// Admin: Reject Recharge
app.post('/api/admin/recharge/:id/reject', (req, res) => {
  const rechargeId = req.params.id;
  const { reason } = req.body;
  const db = readDB();
  const recharge = db.recharges.find(r => r.id === rechargeId);
  if (!recharge) {
    return res.status(404).json({ success: false, message: "Recharge record not found" });
  }

  recharge.status = 'rejected';
  recharge.rejected_reason = reason || "Invalid UTR / Payment not received in bank account";
  recharge.rejected_at = new Date().toISOString();

  writeDB(db);

  return res.json({
    success: true,
    message: "Recharge request rejected",
    recharge
  });
});

// Admin: Get all withdrawals
app.get('/api/admin/withdrawals', (req, res) => {
  const db = readDB();
  return res.json({ success: true, withdrawals: db.withdrawals });
});

// Admin: Approve Withdrawal (marks paid, sets UTR, generates receipt record)
app.post('/api/admin/withdrawal/:id/approve', (req, res) => {
  const wdId = req.params.id;
  const { utr, payment_mode } = req.body || {};
  const db = readDB();
  const withdrawal = db.withdrawals.find(w => w.id === wdId);
  if (!withdrawal) {
    return res.status(404).json({ success: false, message: "Withdrawal not found" });
  }

  const user = db.users.find(u => u.id === withdrawal.user_id || u.phone === withdrawal.user_phone);
  if (user) {
    user.total_withdraw = Number(user.total_withdraw || 0) + Number(withdrawal.amount);
  }

  const finalUtr = (utr && utr.trim()) ? utr.trim() : (withdrawal.utr || ("UTR" + Math.floor(100000000000 + Math.random() * 900000000000)));
  withdrawal.status = 'approved';
  withdrawal.approved_at = new Date().toISOString();
  withdrawal.utr = finalUtr;
  if (payment_mode) withdrawal.payment_mode = payment_mode.trim();

  writeDB(db);

  return res.json({
    success: true,
    message: `Withdrawal of ₹${withdrawal.amount} approved & processed successfully!`,
    withdrawal
  });
});

// Admin: Save Custom Created Receipt
app.post('/api/admin/receipts/custom', (req, res) => {
  const { name, phone, bank_name, account_number, ifsc, upi_id, amount, fee, final_amount, utr, payment_mode, date } = req.body || {};
  if (!name || !amount) {
    return res.status(400).json({ success: false, message: "Name and amount are required" });
  }
  const db = readDB();
  if (!Array.isArray(db.custom_receipts)) db.custom_receipts = [];

  const receipt = {
    id: "rcpt_" + Date.now(),
    name: name.trim(),
    phone: phone ? phone.trim() : "",
    bank_name: bank_name ? bank_name.trim() : "State Bank of India",
    account_number: account_number ? account_number.trim() : "",
    ifsc: ifsc ? ifsc.trim() : "",
    upi_id: upi_id ? upi_id.trim() : "",
    amount: parseFloat(amount) || 0,
    fee: parseFloat(fee) || 0,
    final_amount: parseFloat(final_amount) || parseFloat(amount) || 0,
    utr: utr ? utr.trim() : ("UTR" + Math.floor(100000000000 + Math.random() * 900000000000)),
    payment_mode: payment_mode || "IMPS Instant Bank Payout",
    status: "approved",
    date: date || new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  db.custom_receipts.unshift(receipt);
  writeDB(db);

  return res.json({
    success: true,
    message: "Custom receipt saved successfully!",
    receipt
  });
});

// Admin: Reject Withdrawal (refunds user balance)
app.post('/api/admin/withdrawal/:id/reject', (req, res) => {
  const wdId = req.params.id;
  const { reason } = req.body;
  const db = readDB();
  const withdrawal = db.withdrawals.find(w => w.id === wdId);
  if (!withdrawal) {
    return res.status(404).json({ success: false, message: "Withdrawal not found" });
  }

  if (withdrawal.status === 'rejected') {
    return res.status(400).json({ success: false, message: "Withdrawal already rejected" });
  }

  // Refund user balance
  const user = db.users.find(u => u.id === withdrawal.user_id || u.phone === withdrawal.user_phone);
  if (user) {
    user.balance = Number(user.balance) + Number(withdrawal.amount);
  }

  withdrawal.status = 'rejected';
  withdrawal.rejected_reason = reason || "Incorrect bank details or IFSC mismatch";
  withdrawal.rejected_at = new Date().toISOString();

  writeDB(db);

  return res.json({
    success: true,
    message: `Withdrawal rejected. ₹${withdrawal.amount} refunded back to user's wallet!`,
    withdrawal
  });
});

// Admin: Get All Plans (including inactive)
app.get('/api/admin/plans', (req, res) => {
  const db = readDB();
  return res.json({ success: true, plans: db.plans });
});

// Admin: Create or Update Plan
app.post('/api/admin/plans', upload.single('plan_image'), (req, res) => {
  const { id, title, category, price, daily_income, total_income, cycle_days, limit, status, image_url, coin, hashrate } = req.body;
  const db = readDB();

  let finalImage = image_url || "/images/miner_rig.svg";
  if (req.file) {
    finalImage = `/uploads/${req.file.filename}`;
  }

  if (id) {
    // Update existing
    const existingIndex = db.plans.findIndex(p => p.id === id);
    const durationMin = parseInt(req.body.duration_minutes) || 45;
    const durationLabel = `${durationMin} Min`;

    if (existingIndex !== -1) {
      db.plans[existingIndex] = {
        ...db.plans[existingIndex],
        title: title || db.plans[existingIndex].title,
        coin: coin || db.plans[existingIndex].coin || "BTC",
        hashrate: hashrate || db.plans[existingIndex].hashrate || "120 TH/s",
        category: category || db.plans[existingIndex].category || "normal",
        price: parseFloat(price) || db.plans[existingIndex].price,
        daily_income: parseFloat(daily_income) || db.plans[existingIndex].daily_income,
        total_income: parseFloat(total_income) || db.plans[existingIndex].total_income,
        cycle_days: 0,
        duration_minutes: durationMin,
        duration_label: durationLabel,
        limit: parseInt(limit) || db.plans[existingIndex].limit || 10,
        status: status || db.plans[existingIndex].status || "active",
        image: req.file ? finalImage : (image_url || db.plans[existingIndex].image)
      };
      writeDB(db);
      return res.json({ success: true, message: "Mining plan updated successfully", plan: db.plans[existingIndex] });
    }
  }

  // Add new plan (45-Minute cloud mining cycle)
  const durationMin = parseInt(req.body.duration_minutes) || 45;
  const durationLabel = `${durationMin} Min`;
  const newPlan = {
    id: "plan_" + Date.now(),
    title: title || "New Cloud Mining Rig",
    coin: coin || "BTC",
    hashrate: hashrate || "120 TH/s",
    category: category || "normal",
    price: parseFloat(price) || 500,
    daily_income: parseFloat(daily_income) || parseFloat(total_income) || 4500,
    total_income: parseFloat(total_income) || 4500,
    cycle_days: 0,
    duration_minutes: durationMin,
    duration_label: durationLabel,
    limit: parseInt(limit) || 10,
    status: status || "active",
    image: finalImage
  };

  db.plans.push(newPlan);
  writeDB(db);

  return res.json({ success: true, message: "New mining plan added successfully", plan: newPlan });
});

// Admin: Delete Plan
app.delete('/api/admin/plans/:id', (req, res) => {
  const planId = req.params.id;
  const db = readDB();
  db.plans = db.plans.filter(p => p.id !== planId);
  writeDB(db);
  return res.json({ success: true, message: "Plan deleted successfully" });
});

// Admin: Update Payment QR & Settings
app.post('/api/admin/settings/qr', upload.single('qr_image_file'), (req, res) => {
  const { upi_id, merchant_name, min_recharge, min_withdraw, withdrawal_fee_percent, telegram_channel, telegram_enabled, whatsapp_support, whatsapp_enabled, app_announcement, qr_image_url, usdt_trc20, usdt_bep20, btc_address } = req.body;
  const db = readDB();

  if (req.file) {
    db.settings.qr_image = `/uploads/${req.file.filename}`;
  } else if (qr_image_url && qr_image_url.trim()) {
    db.settings.qr_image = qr_image_url.trim();
  }

  if (upi_id) db.settings.upi_id = upi_id.trim();
  if (merchant_name) db.settings.merchant_name = merchant_name.trim();
  if (min_recharge) db.settings.min_recharge = parseFloat(min_recharge);
  if (min_withdraw) db.settings.min_withdraw = parseFloat(min_withdraw);
  if (withdrawal_fee_percent) db.settings.withdrawal_fee_percent = parseFloat(withdrawal_fee_percent);
  
  if (telegram_channel !== undefined) {
    let t = String(telegram_channel).trim();
    if (t && !t.startsWith('http://') && !t.startsWith('https://')) {
      t = `https://t.me/${t.replace('@', '')}`;
    }
    db.settings.telegram_channel = t || 'https://t.me/VIJAY_SIR_NO1';
  }
  if (telegram_enabled !== undefined) {
    db.settings.telegram_enabled = (telegram_enabled === true || telegram_enabled === 'true' || telegram_enabled === 1 || telegram_enabled === '1');
  }

  if (whatsapp_support !== undefined) {
    db.settings.whatsapp_support = String(whatsapp_support).trim();
  }
  if (whatsapp_enabled !== undefined) {
    db.settings.whatsapp_enabled = (whatsapp_enabled === true || whatsapp_enabled === 'true' || whatsapp_enabled === 1 || whatsapp_enabled === '1');
  }

  if (app_announcement) db.settings.app_announcement = app_announcement.trim();
  if (usdt_trc20) db.settings.usdt_trc20 = usdt_trc20.trim();
  if (usdt_bep20) db.settings.usdt_bep20 = usdt_bep20.trim();
  if (btc_address) db.settings.btc_address = btc_address.trim();

  writeDB(db);

  return res.json({
    success: true,
    message: "Settings, Gateways & Customer Support updated successfully!",
    settings: db.settings,
    config: db.settings
  });
});

// Admin: Update Customer Support Settings (Telegram Handle, WhatsApp & On/Off Toggles)
app.post('/api/admin/settings/support', (req, res) => {
  const { telegram_channel, telegram_enabled, whatsapp_support, whatsapp_enabled } = req.body;
  const db = readDB();

  if (telegram_channel !== undefined) {
    let t = String(telegram_channel).trim();
    if (t && !t.startsWith('http://') && !t.startsWith('https://')) {
      t = `https://t.me/${t.replace('@', '')}`;
    }
    db.settings.telegram_channel = t || 'https://t.me/VIJAY_SIR_NO1';
  }
  if (telegram_enabled !== undefined) {
    db.settings.telegram_enabled = (telegram_enabled === true || telegram_enabled === 'true' || telegram_enabled === 1 || telegram_enabled === '1');
  }

  if (whatsapp_support !== undefined) {
    db.settings.whatsapp_support = String(whatsapp_support).trim();
  }
  if (whatsapp_enabled !== undefined) {
    db.settings.whatsapp_enabled = (whatsapp_enabled === true || whatsapp_enabled === 'true' || whatsapp_enabled === 1 || whatsapp_enabled === '1');
  }

  writeDB(db);

  return res.json({
    success: true,
    message: `Customer Support updated! Telegram: ${db.settings.telegram_enabled ? 'ON (' + db.settings.telegram_channel + ')' : 'OFF'}, WhatsApp: ${db.settings.whatsapp_enabled ? 'ON (' + db.settings.whatsapp_support + ')' : 'OFF'}`,
    settings: db.settings
  });
});

// Public / Client Settings endpoint
app.get('/api/settings', (req, res) => {
  const db = readDB();
  return res.json({ success: true, settings: db.settings });
});

// Admin: Toggle Plan Active / Inactive
app.post('/api/admin/plans/:id/toggle', (req, res) => {
  const planId = req.params.id;
  const db = readDB();
  const plan = db.plans.find(p => p.id === planId);
  if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

  plan.status = plan.status === 'active' ? 'inactive' : 'active';
  writeDB(db);
  return res.json({ success: true, message: `Plan status changed to ${plan.status.toUpperCase()}`, plan });
});

// Admin: Get all users
app.get('/api/admin/users', (req, res) => {
  const db = readDB();
  const safeUsers = db.users.map(u => ({
    id: u.id,
    name: u.name,
    phone: u.phone,
    ref_code: u.ref_code,
    invited_by: u.invited_by,
    balance: Number(u.balance || 0).toFixed(2),
    total_income: Number(u.total_income || 0).toFixed(2),
    total_recharge: Number(u.total_recharge || 0).toFixed(2),
    total_withdraw: Number(u.total_withdraw || 0).toFixed(2),
    gst_percent: u.gst_percent !== undefined && u.gst_percent !== null ? Number(u.gst_percent) : (db.settings.gst_percent || 0),
    commission_percent: u.commission_percent !== undefined && u.commission_percent !== null ? Number(u.commission_percent) : (db.settings.withdrawal_fee_percent || 10),
    custom_tax_name: u.custom_tax_name || "Withdrawal Tax",
    custom_tax_type: u.custom_tax_type || "percent",
    custom_tax_value: u.custom_tax_value !== undefined && u.custom_tax_value !== null ? Number(u.custom_tax_value) : 0,
    withdrawal_notice: u.withdrawal_notice || "",
    status: u.status || 'active',
    bank_account: u.bank_account || null,
    created_at: u.created_at
  }));
  return res.json({ success: true, users: safeUsers });
});

// Admin: Update user custom GST tax, commission and withdrawal notice
app.post('/api/admin/user/:id/tax-settings', (req, res) => {
  const userId = req.params.id;
  const { gst_percent, commission_percent, withdrawal_notice, custom_tax_name, custom_tax_type, custom_tax_value } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.id === userId || u.phone === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (gst_percent !== undefined && gst_percent !== null && gst_percent !== "") {
    user.gst_percent = Math.max(0, parseFloat(gst_percent) || 0);
  }
  if (commission_percent !== undefined && commission_percent !== null && commission_percent !== "") {
    user.commission_percent = Math.max(0, parseFloat(commission_percent) || 0);
  }
  if (custom_tax_name !== undefined) {
    user.custom_tax_name = String(custom_tax_name || '').trim() || "Withdrawal Tax";
  }
  if (custom_tax_type !== undefined) {
    user.custom_tax_type = custom_tax_type === 'flat' ? 'flat' : 'percent';
  }
  if (custom_tax_value !== undefined && custom_tax_value !== null && custom_tax_value !== "") {
    user.custom_tax_value = Math.max(0, parseFloat(custom_tax_value) || 0);
  }
  if (withdrawal_notice !== undefined) {
    user.withdrawal_notice = String(withdrawal_notice || '').trim();
  }

  writeDB(db);
  const taxSummary = user.custom_tax_value > 0 
    ? `${user.custom_tax_name}: ${user.custom_tax_type === 'flat' ? '₹' + user.custom_tax_value : user.custom_tax_value + '%'}`
    : 'No Custom Tax';
  return res.json({
    success: true,
    message: `Tax & Notice updated for ${user.name} (${user.phone})! GST: ${user.gst_percent || 0}%, ${taxSummary}`,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      gst_percent: user.gst_percent,
      commission_percent: user.commission_percent,
      custom_tax_name: user.custom_tax_name,
      custom_tax_type: user.custom_tax_type,
      custom_tax_value: user.custom_tax_value,
      withdrawal_notice: user.withdrawal_notice
    }
  });
});

// Admin: Adjust user balance manually
app.post('/api/admin/user/:id/balance', (req, res) => {
  const userId = req.params.id;
  const { type, amount, reason } = req.body; // type: 'add' or 'deduct'
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  if (type === 'deduct') {
    user.balance = Math.max(0, Number(user.balance) - numAmount);
  } else {
    user.balance = Number(user.balance) + numAmount;
    user.total_income = Number(user.total_income || 0) + numAmount;
  }

  writeDB(db);

  return res.json({
    success: true,
    message: `User balance updated! New balance: ₹${Number(user.balance).toFixed(2)}`,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      balance: Number(user.balance).toFixed(2)
    }
  });
});

// Admin: Toggle User Ban / Unban
app.post('/api/admin/user/:id/toggle-ban', (req, res) => {
  const userId = req.params.id;
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.status = user.status === 'banned' ? 'active' : 'banned';
  writeDB(db);
  return res.json({
    success: true,
    message: `User ${user.name} (+91 ${user.phone}) marked as ${user.status.toUpperCase()}`,
    status: user.status
  });
});

// Admin: Reset User Password
app.post('/api/admin/user/:id/reset-password', (req, res) => {
  const userId = req.params.id;
  const { new_password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.password = (new_password || "123456").trim();
  writeDB(db);
  return res.json({
    success: true,
    message: `Password for ${user.name} reset to: "${user.password}"`
  });
});

// Admin: Delete User
app.delete('/api/admin/user/:id', (req, res) => {
  const userId = req.params.id;
  const db = readDB();
  const idx = db.users.findIndex(u => u.id === userId);
  if (idx === -1) return res.status(404).json({ success: false, message: "User not found" });

  db.users.splice(idx, 1);
  writeDB(db);
  return res.json({ success: true, message: "User removed from system" });
});

// Admin: Export Data (JSON)
app.get('/api/admin/export/:type', (req, res) => {
  const type = req.params.type;
  const db = readDB();
  let exportData = [];

  if (type === 'recharges') exportData = db.recharges;
  else if (type === 'withdrawals') exportData = db.withdrawals;
  else if (type === 'users') exportData = db.users;
  else if (type === 'plans') exportData = db.plans;
  else exportData = db;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=cryptominers_${type}_${Date.now()}.json`);
  return res.send(JSON.stringify(exportData, null, 2));
});

// Admin: Dedicated Instant QR Upload
app.post('/api/admin/settings/upload-qr', (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("[Multer Upload Single Error]:", err.message);
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    next();
  });
}, (req, res) => {
  const file = (req.files && req.files.length > 0) ? req.files[0] : req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: "No image file provided" });
  }
  const db = readDB();
  ensureQrCodes(db);
  const newQrPath = `/uploads/${file.filename}`;
  db.settings.qr_image = newQrPath;
  const newQrItem = {
    id: "qr_" + Date.now(),
    image: newQrPath,
    title: req.body.title ? req.body.title.trim() : `QR Channel #${db.settings.qr_codes.length + 1}`,
    upi_id: (req.body.upi_id && req.body.upi_id.trim()) ? req.body.upi_id.trim() : (db.settings.upi_id || "cryptominers@okaxis"),
    status: "active",
    created_at: new Date().toISOString(),
    hits: 0
  };
  db.settings.qr_codes.unshift(newQrItem);
  writeDB(db);

  return res.json({
    success: true,
    message: "QR Code uploaded & added to rotation pool successfully!",
    qr_image: newQrPath,
    qr_item: newQrItem,
    settings: db.settings,
    config: db.settings
  });
});

// Admin: Get all QR Codes in pool
app.get('/api/admin/settings/qr-codes', (req, res) => {
  const db = readDB();
  ensureQrCodes(db);
  return res.json({
    success: true,
    qr_codes: db.settings.qr_codes || [],
    total: (db.settings.qr_codes || []).length,
    active_count: (db.settings.qr_codes || []).filter(q => q.status === 'active').length,
    rotation_index: db.settings.qr_rotation_index || 0
  });
});

// Admin: Upload Multiple QR Codes at once (Batch upload 1, 2, 3, 5+ QRs)
app.post('/api/admin/settings/upload-multiple-qrs', (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("[Multer Upload Multiple Error]:", err.message);
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    next();
  });
}, (req, res) => {
  const files = (req.files && Array.isArray(req.files)) ? req.files : [];
  if (files.length === 0) {
    return res.status(400).json({ success: false, message: "No QR image files provided. Please select at least 1 image." });
  }

  const db = readDB();
  ensureQrCodes(db);

  const upiId = (req.body.upi_id && req.body.upi_id.trim()) 
    ? req.body.upi_id.trim() 
    : (req.body.custom_upi && req.body.custom_upi.trim())
      ? req.body.custom_upi.trim()
      : (db.settings.upi_id || 'cryptominers@okaxis');

  const baseTitle = (req.body.title && req.body.title.trim()) 
    ? req.body.title.trim() 
    : (req.body.title_prefix && req.body.title_prefix.trim())
      ? req.body.title_prefix.trim()
      : 'Payment Channel';

  const newQrs = files.map((file, idx) => {
    const channelNum = db.settings.qr_codes.length + idx + 1;
    return {
      id: "qr_" + Date.now() + "_" + (idx + 1) + "_" + Math.floor(Math.random() * 1000),
      image: `/uploads/${file.filename}`,
      title: `${baseTitle} #${channelNum}`,
      upi_id: upiId,
      status: "active",
      created_at: new Date().toISOString(),
      hits: 0
    };
  });

  db.settings.qr_codes.push(...newQrs);
  if (db.settings.qr_codes.length > 0 && !db.settings.qr_image) {
    db.settings.qr_image = db.settings.qr_codes[0].image;
  }
  writeDB(db);

  const count = newQrs.length;
  return res.json({
    success: true,
    message: `Successfully uploaded ${count} QR code(s) to rotation pool!`,
    addedCount: count,
    added_count: count,
    qr_codes: db.settings.qr_codes
  });
});

// Admin: Toggle QR Code Active/Inactive
app.post('/api/admin/settings/qr-codes/:id/toggle', (req, res) => {
  const qrId = req.params.id;
  const db = readDB();
  ensureQrCodes(db);

  const qr = db.settings.qr_codes.find(q => q.id === qrId);
  if (!qr) return res.status(404).json({ success: false, message: "QR code not found" });

  qr.status = qr.status === 'active' ? 'inactive' : 'active';
  writeDB(db);

  return res.json({
    success: true,
    message: `QR "${qr.title}" is now ${qr.status.toUpperCase()}`,
    qr
  });
});

// Admin: Set a QR Code as Primary
app.post('/api/admin/settings/qr-codes/:id/set-primary', (req, res) => {
  const qrId = req.params.id;
  const db = readDB();
  ensureQrCodes(db);

  const qrIdx = db.settings.qr_codes.findIndex(q => q.id === qrId);
  if (qrIdx === -1) return res.status(404).json({ success: false, message: "QR code not found" });

  const [qr] = db.settings.qr_codes.splice(qrIdx, 1);
  qr.status = 'active';
  db.settings.qr_codes.unshift(qr);
  db.settings.qr_image = qr.image;
  db.settings.qr_rotation_index = 0;
  writeDB(db);

  return res.json({
    success: true,
    message: `QR "${qr.title}" is now set as primary!`,
    qr,
    qr_codes: db.settings.qr_codes
  });
});

// Admin: Delete QR Code
app.delete('/api/admin/settings/qr-codes/:id', (req, res) => {
  const qrId = req.params.id;
  const db = readDB();
  ensureQrCodes(db);

  const initialCount = db.settings.qr_codes.length;
  db.settings.qr_codes = db.settings.qr_codes.filter(q => q.id !== qrId);

  if (db.settings.qr_codes.length === initialCount) {
    return res.status(404).json({ success: false, message: "QR code not found" });
  }

  // Update default qr_image if needed
  const firstActive = db.settings.qr_codes.find(q => q.status === 'active');
  if (firstActive) {
    db.settings.qr_image = firstActive.image;
  }
  writeDB(db);

  return res.json({
    success: true,
    message: "QR code deleted from rotation pool",
    remaining: db.settings.qr_codes.length
  });
});

// Admin: Update QR Code details (title, UPI ID)
app.post('/api/admin/settings/qr-codes/:id/update', (req, res) => {
  const qrId = req.params.id;
  const { title, upi_id } = req.body;
  const db = readDB();
  ensureQrCodes(db);

  const qr = db.settings.qr_codes.find(q => q.id === qrId);
  if (!qr) return res.status(404).json({ success: false, message: "QR code not found" });

  if (title && title.trim()) qr.title = title.trim();
  if (upi_id && upi_id.trim()) qr.upi_id = upi_id.trim();
  writeDB(db);

  return res.json({
    success: true,
    message: "QR code details updated successfully",
    qr
  });
});

// Admin: Change Credentials
app.post('/api/admin/change-password', (req, res) => {
  const { current_password, new_username, new_password } = req.body;
  const db = readDB();
  if (db.admin.password !== current_password) {
    return res.status(400).json({ success: false, message: "Current password is incorrect" });
  }
  if (new_username && new_username.trim()) {
    db.admin.username = new_username.trim();
  }
  if (new_password && new_password.trim().length >= 4) {
    db.admin.password = new_password.trim();
  }
  writeDB(db);
  return res.json({ success: true, message: "Admin credentials updated successfully!" });
});

// Admin: Manual Balance Credit / Debit with full record
app.post('/api/admin/transactions/manual', (req, res) => {
  const { phone, type, amount, reason } = req.body; // type: 'recharge' or 'withdrawal'
  const numAmount = parseFloat(amount);
  if (!phone || isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ success: false, message: "Valid phone and positive amount required" });
  }

  const db = readDB();
  const cleanPhone = String(phone).trim();
  const user = db.users.find(u => String(u.phone).trim() === cleanPhone);
  if (!user) {
    return res.status(404).json({ success: false, message: `User with phone ${phone} not found` });
  }

  if (type === 'recharge') {
    user.balance = Number(user.balance) + numAmount;
    user.total_recharge = Number(user.total_recharge || 0) + numAmount;
    const rc = {
      id: "rc_man_" + Date.now(),
      user_id: user.id,
      user_name: user.name,
      user_phone: user.phone,
      amount: numAmount,
      utr: "MANUAL_" + Math.floor(100000 + Math.random() * 900000),
      screenshot: db.settings.qr_image || "/images/logo.svg",
      status: "approved",
      date: new Date().toISOString(),
      note: reason || "Manual credit by Admin"
    };
    db.recharges.unshift(rc);
    writeDB(db);
    return res.json({ success: true, message: `₹${numAmount} credited to ${user.name}! New Balance: ₹${Number(user.balance).toFixed(2)}`, record: rc });
  } else {
    if (Number(user.balance) < numAmount) {
      return res.status(400).json({ success: false, message: `User only has ₹${Number(user.balance).toFixed(2)} available` });
    }
    user.balance = Number(user.balance) - numAmount;
    user.total_withdraw = Number(user.total_withdraw || 0) + numAmount;
    const wd = {
      id: "wd_man_" + Date.now(),
      user_id: user.id,
      user_name: user.name,
      user_phone: user.phone,
      amount: numAmount,
      fee: 0,
      final_amount: numAmount,
      bank_account: user.bank_account || { account_holder: user.name, bank_name: "Manual Settlement", account_number: "OFFLINE", ifsc: "", upi_id: "" },
      status: "approved",
      date: new Date().toISOString(),
      note: reason || "Manual payout by Admin"
    };
    db.withdrawals.unshift(wd);
    writeDB(db);
    return res.json({ success: true, message: `₹${numAmount} deducted & marked paid for ${user.name}! New Balance: ₹${Number(user.balance).toFixed(2)}`, record: wd });
  }
});

// Admin: Export CSV
app.get('/api/admin/export-csv/:type', (req, res) => {
  const type = req.params.type;
  const db = readDB();
  let csv = "";

  if (type === 'recharges') {
    csv = "ID,User Name,Phone,Amount,UTR,Status,Date,Note\n";
    db.recharges.forEach(r => {
      csv += `"${r.id}","${r.user_name || ''}","${r.user_phone || ''}","${r.amount}","${r.utr || ''}","${r.status}","${r.date || ''}","${(r.note || '').replace(/"/g, '""')}"\n`;
    });
  } else if (type === 'withdrawals') {
    csv = "ID,User Name,Phone,Amount,Fee,Net Amount,Bank Name,Account Number,IFSC,UPI ID,Status,Date\n";
    db.withdrawals.forEach(w => {
      const b = w.bank_account || {};
      csv += `"${w.id}","${w.user_name || ''}","${w.user_phone || ''}","${w.amount}","${w.fee || 0}","${w.final_amount || w.amount}","${b.bank_name || ''}","${b.account_number || ''}","${b.ifsc || ''}","${b.upi_id || ''}","${w.status}","${w.date || ''}"\n`;
    });
  } else {
    csv = "ID,Name,Phone,Referral Code,Balance,Total Income,Total Recharge,Total Withdraw,Status,Joined Date\n";
    db.users.forEach(u => {
      csv += `"${u.id}","${u.name || ''}","${u.phone || ''}","${u.ref_code || ''}","${u.balance || 0}","${u.total_income || 0}","${u.total_recharge || 0}","${u.total_withdraw || 0}","${u.status || 'active'}","${u.created_at || ''}"\n`;
    });
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=cryptominers_${type}_${Date.now()}.csv`);
  return res.send(csv);
});

// Admin: Full DB Backup download
app.get('/api/admin/backup/db', (req, res) => {
  const db = readDB();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=cryptominers_database_backup_${Date.now()}.json`);
  return res.send(JSON.stringify(db, null, 2));
});

// ----------------- HEALTH CHECK & UPTIME MONITORING (RENDER COMPATIBLE) -----------------
app.get(['/health', '/api/health', '/ping'], (req, res) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (3600 * 24));
  const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  res.status(200).json({
    status: "ok",
    service: "CryptoMiners Energy Investment Portal",
    uptime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    uptimeSeconds: Math.floor(uptimeSeconds),
    timestamp: new Date().toISOString(),
    serverTime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    database: "connected",
    version: "2.0.0"
  });
});

// Dedicated Admin Portal Route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Render Keep-Alive Auto Self-Ping (prevents free tier sleep)
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
if (RENDER_EXTERNAL_URL) {
  const https = require('https');
  const pingInterval = 10 * 60 * 1000; // 10 minutes
  setInterval(() => {
    https.get(`${RENDER_EXTERNAL_URL}/health`, (pingRes) => {
      console.log(`[KeepAlive] Pinged ${RENDER_EXTERNAL_URL}/health - Status: ${pingRes.statusCode}`);
    }).on('error', (err) => {
      console.error(`[KeepAlive] Ping error: ${err.message}`);
    });
  }, pingInterval);
  console.log(`[KeepAlive] Auto self-ping activated for ${RENDER_EXTERNAL_URL}`);
}

// Global Error Handling Middleware (Handles Multer errors gracefully as JSON)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("[Multer Error]:", err.message);
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  } else if (err) {
    console.error("[Server Error]:", err.message);
    return res.status(400).json({ success: false, message: err.message || "An unexpected error occurred" });
  }
  next();
});

// Fallback index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Bind to 0.0.0.0 for Cloud / Render hosting
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

