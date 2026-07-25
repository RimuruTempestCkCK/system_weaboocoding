import { supabase, isSupabaseConfigured } from "./supabaseClient";

/**
 * Fetch all monthly recap data from Supabase
 */
export async function fetchAllMonthDataFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    // 1. Fetch all months
    const { data: months, error: monthError } = await supabase
      .from("recap_months")
      .select("*")
      .order("month_key", { ascending: false });

    if (monthError) {
      console.error("Error fetching months from Supabase:", monthError);
      return null;
    }

    // 2. Fetch all transactions
    const { data: transactions, error: trxError } = await supabase
      .from("transactions")
      .select("*")
      .order("no", { ascending: true });

    if (trxError) {
      console.error("Error fetching transactions from Supabase:", trxError);
      return null;
    }

    // 3. Format into App's month data structure
    const formattedData = {};

    months.forEach((m) => {
      formattedData[m.month_key] = {
        monthName: m.month_name,
        catatan: m.catatan || "",
        transactions: []
      };
    });

    transactions.forEach((t) => {
      if (formattedData[t.month_key]) {
        formattedData[t.month_key].transactions.push({
          id: t.id,
          no: t.no,
          tanggal: t.tanggal || "",
          jenisJasa: t.jenis_jasa || "",
          caraBayar: t.cara_bayar || "",
          price: Number(t.price) || 0,
          dp: Number(t.dp) || 0,
          sisa: Number(t.sisa) || 0,
          ket: t.ket || "Belum Lunas",
          tglPelunasan: t.tgl_pelunasan || ""
        });
      }
    });

    return formattedData;
  } catch (err) {
    console.error("Supabase fetch exception:", err);
    return null;
  }
}

/**
 * Save or Update a single transaction in Supabase
 */
export async function saveTransactionToSupabase(monthKey, trx) {
  if (!isSupabaseConfigured || !supabase) return null;

  const payload = {
    month_key: monthKey,
    no: Number(trx.no),
    tanggal: trx.tanggal || "",
    jenis_jasa: trx.jenisJasa || "",
    cara_bayar: trx.caraBayar || "",
    price: Number(trx.price) || 0,
    dp: Number(trx.dp) || 0,
    sisa: Number(trx.sisa) || 0,
    ket: trx.ket || "Belum Lunas",
    tgl_pelunasan: trx.tglPelunasan || ""
  };

  if (trx.id) {
    payload.id = trx.id;
  }

  const { data, error } = await supabase
    .from("transactions")
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error saving transaction to Supabase:", error);
    return null;
  }

  return data;
}

/**
 * Delete a transaction from Supabase
 */
export async function deleteTransactionFromSupabase(trxId) {
  if (!isSupabaseConfigured || !supabase || !trxId) return false;

  const { error } = await supabase.from("transactions").delete().eq("id", trxId);

  if (error) {
    console.error("Error deleting transaction from Supabase:", error);
    return false;
  }

  return true;
}

/**
 * Update month notes in Supabase
 */
export async function updateMonthCatatanInSupabase(monthKey, catatan) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase
    .from("recap_months")
    .update({ catatan })
    .eq("month_key", monthKey);

  if (error) {
    console.error("Error updating month catatan in Supabase:", error);
    return false;
  }

  return true;
}

/**
 * Create a new month in Supabase
 */
export async function createMonthInSupabase(monthKey, monthName, catatan = "") {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from("recap_months")
    .upsert({
      month_key: monthKey,
      month_name: monthName,
      catatan
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating month in Supabase:", error);
    return null;
  }

  return data;
}

/**
 * Authenticate user against Supabase app_users table
 */
export async function authenticateUserFromSupabase(username, password) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from("app_users")
      .select("*")
      .eq("username", username.trim())
      .eq("password", password)
      .maybeSingle();

    if (error) {
      console.error("Supabase user authentication error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Supabase auth exception:", err);
    return null;
  }
}

/**
 * Seed initial users to Supabase if app_users is empty
 */
export async function seedInitialUsersToSupabase(mockUsers) {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { count } = await supabase
      .from("app_users")
      .select("*", { count: "exact", head: true });

    if (count > 0) return;

    console.log("Seeding initial users to Supabase...");
    for (const u of mockUsers) {
      await supabase.from("app_users").upsert({
        username: u.username,
        password: u.password,
        name: u.name,
        role: u.role,
        email: u.email || ""
      });
    }
  } catch (err) {
    console.error("Error seeding users to Supabase:", err);
  }
}

/**
 * Seed initial data to Supabase if tables are empty
 */
export async function seedInitialDataToSupabase(initialData) {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { count } = await supabase
      .from("recap_months")
      .select("*", { count: "exact", head: true });

    if (count > 0) return; // Already has data

    console.log("Seeding initial data to Supabase...");
    for (const [mKey, mVal] of Object.entries(initialData)) {
      await createMonthInSupabase(mKey, mVal.monthName, mVal.catatan || "");
      for (const trx of mVal.transactions) {
        await saveTransactionToSupabase(mKey, trx);
      }
    }
  } catch (err) {
    console.error("Error seeding initial data to Supabase:", err);
  }
}

