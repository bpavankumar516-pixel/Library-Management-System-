import axios from "axios";

const STORAGE_KEY = "librabook_members_v4";

const CATALOG_BOOKS = [
  { title: "Atomic Habits", id: "book_1" },
  { title: "Clean Code", id: "book_2" },
  { title: "Design Patterns", id: "book_3" },
  { title: "The Alchemist", id: "book_4" },
  { title: "Dune", id: "book_5" },
  { title: "Rich Dad Poor Dad", id: "book_6" },
  { title: "To Kill a Mockingbird", id: "book_7" },
  { title: "The Pragmatic Programmer", id: "book_8" },
  { title: "Deep Work", id: "book_9" },
  { title: "Sapiens: A Brief History", id: "book_10" },
  { title: "The Psychology of Money", id: "book_11" },
  { title: "Foundation", id: "book_12" },
];

// Helper to format DummyJSON users into LibraBook member objects
function mapDummyJsonUser(user, index) {
  const memberNum = String(index + 1).padStart(3, "0");
  const isInactive = index % 8 === 3; // Realistic spread of active / inactive members
  const joinDay = ((index * 3) % 28) + 1;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[index % 12];
  const joinDate = `${String(joinDay).padStart(2, "0")} ${month} 2025`;

  // Clean 10-digit mobile number
  const digitsOnly = user.phone ? user.phone.replace(/[^0-9]/g, "") : "";
  const cleanMobile =
    digitsOnly.length >= 10
      ? digitsOnly.slice(-10)
      : `98765${String(10000 + user.id).slice(-5)}`;

  // Full address string
  const addressStr = user.address
    ? `${user.address.address}, ${user.address.city}, ${user.address.state} - ${user.address.postalCode}`
    : "123 MG Road, Bangalore, Karnataka - 560001";

  const primaryBook = CATALOG_BOOKS[index % CATALOG_BOOKS.length];
  const pastBook = CATALOG_BOOKS[(index + 3) % CATALOG_BOOKS.length];
  const secondActiveBook = CATALOG_BOOKS[(index + 6) % CATALOG_BOOKS.length];
  const isOverdue = index % 5 === 0;

  const issueHistory = [
    {
      id: `${user.id}_loan_1`,
      bookId: primaryBook.id,
      bookTitle: primaryBook.title,
      issueDate: isOverdue ? "25 Sep 2025" : "02 Oct 2025",
      dueDate: isOverdue ? "09 Oct 2025" : "16 Oct 2025",
      returnDate: "-",
      status: isOverdue ? "Overdue" : "Issued",
    },
    {
      id: `${user.id}_loan_2`,
      bookId: pastBook.id,
      bookTitle: pastBook.title,
      issueDate: "10 Sep 2025",
      dueDate: "24 Sep 2025",
      returnDate: "22 Sep 2025",
      status: "Returned",
    },
  ];

  if (index % 3 === 0) {
    issueHistory.unshift({
      id: `${user.id}_loan_3`,
      bookId: secondActiveBook.id,
      bookTitle: secondActiveBook.title,
      issueDate: "05 Oct 2025",
      dueDate: "19 Oct 2025",
      returnDate: "-",
      status: "Issued",
    });
  }

  const activeLoanCount = issueHistory.filter((i) => i.status === "Issued" || i.status === "Overdue").length;

  return {
    id: `dummy_${user.id}`,
    membershipId: `LIB${memberNum}`,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    mobile: cleanMobile,
    joinDate,
    status: isInactive ? "Inactive" : "Active",
    avatarUrl: user.image || `https://i.pravatar.cc/150?u=${user.id}`,
    address: addressStr,
    booksIssued: activeLoanCount,
    booksReturned: (index % 7) + 2,
    overdueBooks: isOverdue ? 1 : 0,
    totalFine: isOverdue ? 50 : 0,
    issueHistory,
    fineHistory: isOverdue
      ? [
          {
            id: 1,
            reason: `Late return fee (${primaryBook.title})`,
            amount: 50,
            date: "10 Oct 2025",
            status: "Pending",
          },
        ]
      : [],
  };
}

export const memberService = {
  // Fetch members directly from DummyJSON Users API (50 users)
  async getMembers() {
    // 1. Check local storage
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error("Failed to parse cached members:", err);
      }
    }

    // 2. Fetch 50 users from DummyJSON API
    try {
      const response = await axios.get("https://dummyjson.com/users?limit=30", {
        timeout: 5000,
      });
      if (response.data && Array.isArray(response.data.users)) {
        const mappedMembers = response.data.users.map((u, i) =>
          mapDummyJsonUser(u, i),
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedMembers));
        return mappedMembers;
      }
    } catch (err) {
      console.warn(
        "DummyJSON API fetch failed, generating fallback records:",
        err.message,
      );
    }

    // Fallback if offline
    const fallbackMembers = Array.from({ length: 50 }, (_, i) => ({
      id: `mem_${i + 1}`,
      membershipId: `LIB${String(i + 1).padStart(3, "0")}`,
      name: `Member ${i + 1}`,
      email: `member${i + 1}@example.com`,
      mobile: `9876543${String(i + 10).padStart(3, "0")}`,
      joinDate: "15 Jan 2025",
      status: i % 7 === 3 ? "Inactive" : "Active",
      avatarUrl: `https://i.pravatar.cc/150?u=${i + 1}`,
      address: "123 MG Road, Bangalore, Karnataka - 560001",
      booksIssued: (i % 5) + 1,
      booksReturned: (i % 7) + 2,
      overdueBooks: i % 6 === 0 ? 1 : 0,
      totalFine: i % 6 === 0 ? 50 : 0,
      issueHistory: [],
      fineHistory: [],
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackMembers));
    return fallbackMembers;
  },

  // Get single member by ID
  async getMemberById(id) {
    const members = await this.getMembers();
    const found = members.find(
      (m) => String(m.id) === String(id) || m.membershipId === id,
    );
    if (!found) throw new Error("Member not found");
    return found;
  },

  // Create new member
  async createMember(memberData) {
    await new Promise((r) => setTimeout(r, 200));
    const members = await this.getMembers();

    const newId = `mem_${Date.now()}`;
    const nextMemberNum = String(members.length + 1).padStart(3, "0");

    const newMember = {
      id: newId,
      membershipId: memberData.membershipId || `LIB${nextMemberNum}`,
      name: memberData.name.trim(),
      email: memberData.email.trim(),
      mobile: memberData.mobile.trim(),
      joinDate: memberData.joinDate || "11 Oct 2025",
      status: memberData.status || "Active",
      avatarUrl:
        memberData.avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80",
      address: memberData.address || "Bangalore, Karnataka",
      booksIssued: 0,
      booksReturned: 0,
      overdueBooks: 0,
      totalFine: 0,
      issueHistory: [],
      fineHistory: [],
    };

    const updated = [newMember, ...members];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newMember;
  },

  // Update existing member
  async updateMember(id, updateData) {
    await new Promise((r) => setTimeout(r, 200));
    const members = await this.getMembers();
    const index = members.findIndex((m) => String(m.id) === String(id));

    if (index === -1) throw new Error("Member not found");

    const updatedMember = {
      ...members[index],
      ...updateData,
    };

    members[index] = updatedMember;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    return updatedMember;
  },

  // Delete member
  async deleteMember(id) {
    await new Promise((r) => setTimeout(r, 200));
    const members = await this.getMembers();
    const filtered = members.filter((m) => String(m.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Reset to default DummyJSON API
  async resetMembers() {
    localStorage.removeItem(STORAGE_KEY);
    return this.getMembers();
  },
};
