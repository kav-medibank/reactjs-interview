const MOCK_DATA = {
  users: [
    { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
    { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },
    { id: 4, name: "David", email: "david@example.com", role: "guest" },
  ],
  posts: [
    { id: 101, userId: 1, title: "First Post", content: "Lorem ipsum." },
    { id: 102, userId: 2, title: "Second Post", content: "Dolor sit amet." },
    {
      id: 103,
      userId: 1,
      title: "Another Admin Post",
      content: "Consectetur adipiscing elit.",
    },
    {
      id: 104,
      userId: 3,
      title: "User Post",
      content: "Sed do eiusmod tempor.",
    },
  ],
  comments: [
    { id: 201, postId: 101, userId: 2, text: "Great post, Alice!" },
    { id: 202, postId: 102, userId: 1, text: "Interesting perspective." },
    { id: 203, postId: 101, userId: 3, text: "I agree." },
    { id: 204, postId: 104, userId: 1, text: "Nice one, Charlie!" },
  ],
  permissions: {
    admin: ["read", "write", "delete", "manageUsers"],
    user: ["read", "write"],
    guest: ["read"],
  },
};

/**
 * Simulates an asynchronous network request.
 * @param {string} endpoint - The data key to fetch (e.g., 'users', 'posts').
 * @param {number} delay - Artificial delay in milliseconds.
 * @param {boolean} shouldFail - Whether the request should intentionally fail.
 * @returns {Promise<Array<Object>>} A promise that resolves with data or rejects with an error.
 */
function mockApiCall(endpoint, delay = 100, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`API Error: Failed to fetch ${endpoint} data.`));
      } else if (MOCK_DATA[endpoint]) {
        resolve(MOCK_DATA[endpoint]);
      } else {
        reject(new Error(`API Error: Endpoint '${endpoint}' not found.`));
      }
    }, delay);
  });
}

let processedRecords = [];

/**
 * Fetches user data and processes it, including related posts and comments.
 * This function is designed to handle a single user's data aggregation.
 * @param {number} userId - The ID of the user to fetch data for.
 */
async function fetchUserDataAndProcess(userId) {
  console.log(`[User ${userId}] Initiating fetch and process...`);
  let userData = null;
  let userPosts = [];
  let postComments = [];

  try {
    const users = await mockApiCall("users", 200);
    userData = users.find((u) => u.id === userId);

    if (!userData) {
      console.warn(`[User ${userId}] User not found.`);
      return;
    }

    const [posts, comments] = await Promise.all([
      mockApiCall("posts", 150),
      mockApiCall("comments", 150),
    ]);

    userPosts = posts.filter((p) => p.userId === userId);

    for (const post of userPosts) {
      const commentsForPost = comments.filter((c) => c.postId === post.id);
      postComments.push({ postId: post.id, comments: commentsForPost });
    }

    processedRecords.push({
      user: userData.name,
      postsCount: userPosts.length,
      commentsDetailed: postComments,
    });
  } catch (error) {
    console.error(
      `[User ${userId}] Failed to fetch or process data:`,
      error.message
    );
  }
  console.log(`[User ${userId}] Processing complete.`);
}

/**
 * Enriches a list of users with their associated permissions based on their role.
 * This function demonstrates data transformation.
 * @param {Array<Object>} users - An array of user objects.
 * @returns {Array<Object>} The enriched user data.
 */
function enrichUsersWithPermissions(users) {
  console.log("Enriching users with permissions...");
  if (!Array.isArray(users)) {
    console.error("Invalid input: 'users' must be an array.");
    return [];
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const permissions = MOCK_DATA.permissions[user?.role] || [];

    user.permissions = permissions;
  }
  return users;
}

/**
 * Displays all users along with their roles and permissions.
 * This function showcases data retrieval and display.
 */
async function displayAllUsersWithPermissions() {
  console.log("\nDisplaying all users with their permissions...");
  let usersToDisplay = [];
  try {
    usersToDisplay = await mockApiCall("users");
  } catch (error) {
    console.error("Failed to fetch users for display:", error.message);
  }

  const enrichedUsers = enrichUsersWithPermissions(usersToDisplay);

  if (enrichedUsers && enrichedUsers.length > 0) {
    enrichedUsers.forEach((user) => {
      console.log(
        `- ${user.name} (${user.email}) - Role: ${
          user.role
        }, Permissions: ${user.permissions.join(", ")}`
      );
    });
  } else {
    console.log("No users to display or an error occurred during fetch.");
  }
}

/**
 * Orchestrates the data fetching and processing pipeline for the application.
 * This is the main entry point for the application logic.
 */
async function mainApplicationLogic() {
  console.log("\n--- Starting main application logic ---");

  const processingAttempts = [
    fetchUserDataAndProcess(1),
    fetchUserDataAndProcess(2),
    fetchUserDataAndProcess(4),
    fetchUserDataAndProcess(99),
    mockApiCall("nonExistentEndpoint", 50, true),
  ];

  const results = await Promise.allSettled(processingAttempts);

  console.log("\n--- All user-specific processing attempts finished ---");
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.warn(
        `Attempt ${index + 1} for data processing rejected:`,
        result.reason
      );
    } else {
      console.log(`Attempt ${index + 1} for data processing fulfilled.`);
    }
  });

  console.log("\nFinal processed records count:", processedRecords.length);
  console.log(
    "Contents of processedRecords:",
    JSON.stringify(processedRecords, null, 2)
  );

  await displayAllUsersWithPermissions();

  console.log("\n--- Main application logic finished ---");
}

mainApplicationLogic();
