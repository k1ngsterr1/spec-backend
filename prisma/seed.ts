import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "cities" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "categories" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "statuses" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "tasks" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "balance_history" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "task_history" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "user_category" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "forms" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "fcm_token" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "no_application_text" CASCADE;`;

  // Reset sequences
  await prisma.$executeRaw`ALTER SEQUENCE "users_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "cities_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "categories_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "statuses_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "tasks_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "balance_history_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "task_history_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "user_category_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "forms_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "fcm_token_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "no_application_text_id_seq" RESTART WITH 1;`;

  // Create cities
  console.log('Creating cities...');
  const cities = await Promise.all([
    prisma.cities.create({ data: { name: 'New York' } }),
    prisma.cities.create({ data: { name: 'Los Angeles' } }),
    prisma.cities.create({ data: { name: 'Chicago' } }),
    prisma.cities.create({ data: { name: 'Houston' } }),
    prisma.cities.create({ data: { name: 'Phoenix' } }),
  ]);

  // Create categories
  console.log('Creating categories...');
  const mainCategories = await Promise.all([
    prisma.categories.create({ data: { name: 'Home Services' } }),
    prisma.categories.create({ data: { name: 'Professional Services' } }),
    prisma.categories.create({ data: { name: 'Personal Assistance' } }),
    prisma.categories.create({ data: { name: 'Delivery' } }),
    prisma.categories.create({ data: { name: 'Technical Support' } }),
  ]);

  // Create subcategories
  const subCategories = await Promise.all([
    // Home Services subcategories
    prisma.categories.create({
      data: {
        name: 'Cleaning',
        parent_id: mainCategories[0].id,
      },
    }),
    prisma.categories.create({
      data: {
        name: 'Plumbing',
        parent_id: mainCategories[0].id,
      },
    }),
    prisma.categories.create({
      data: {
        name: 'Electrical',
        parent_id: mainCategories[0].id,
      },
    }),

    // Professional Services subcategories
    prisma.categories.create({
      data: {
        name: 'Legal Consultation',
        parent_id: mainCategories[1].id,
      },
    }),
    prisma.categories.create({
      data: {
        name: 'Financial Advice',
        parent_id: mainCategories[1].id,
      },
    }),

    // Personal Assistance subcategories
    prisma.categories.create({
      data: {
        name: 'Shopping',
        parent_id: mainCategories[2].id,
      },
    }),
    prisma.categories.create({
      data: {
        name: 'Pet Care',
        parent_id: mainCategories[2].id,
      },
    }),

    // Delivery subcategories
    prisma.categories.create({
      data: {
        name: 'Food Delivery',
        parent_id: mainCategories[3].id,
      },
    }),
    prisma.categories.create({
      data: {
        name: 'Package Delivery',
        parent_id: mainCategories[3].id,
      },
    }),

    // Technical Support subcategories
    prisma.categories.create({
      data: {
        name: 'Computer Repair',
        parent_id: mainCategories[4].id,
      },
    }),
    prisma.categories.create({
      data: {
        name: 'Smartphone Support',
        parent_id: mainCategories[4].id,
      },
    }),
  ]);

  // Create statuses
  console.log('Creating statuses...');
  const statuses = await Promise.all([
    prisma.statuses.create({ data: { name: 'Created' } }),
    prisma.statuses.create({ data: { name: 'In Progress' } }),
    prisma.statuses.create({ data: { name: 'Completed' } }),
    prisma.statuses.create({ data: { name: 'Cancelled' } }),
    prisma.statuses.create({ data: { name: 'Pending Payment' } }),
  ]);

  // Create users
  console.log('Creating users...');
  const passwordHash = await hash('password123', 10);
  const adminPasswordHash = await hash('admin123', 10);

  const users = await Promise.all([
    // Admin user
    prisma.users.create({
      data: {
        username: 'admin',
        fullname: 'System Administrator',
        phone: '+1234567890',
        password_hash: adminPasswordHash,
        city_id: cities[0].id,
        role: 'admin',
        priority: 100,
        app_token: 'admin-token-123',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    }),

    // Regular users
    prisma.users.create({
      data: {
        username: 'john_doe',
        fullname: 'John Doe',
        phone: '+1987654321',
        password_hash: passwordHash,
        city_id: cities[0].id,
        role: 'user',
        priority: 10,
        app_token: 'user-token-123',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      },
    }),
    prisma.users.create({
      data: {
        username: 'jane_smith',
        fullname: 'Jane Smith',
        phone: '+1122334455',
        password_hash: passwordHash,
        city_id: cities[1].id,
        role: 'user',
        priority: 10,
        app_token: 'user-token-456',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    }),
    prisma.users.create({
      data: {
        username: 'bob_johnson',
        fullname: 'Bob Johnson',
        phone: '+1555666777',
        password_hash: passwordHash,
        city_id: cities[2].id,
        role: 'user',
        priority: 5,
        app_token: 'user-token-789',
        user_agent: 'Mozilla/5.0 (Linux; Android 10)',
      },
    }),
    prisma.users.create({
      data: {
        username: 'alice_williams',
        fullname: 'Alice Williams',
        phone: '+1777888999',
        password_hash: passwordHash,
        city_id: cities[3].id,
        role: 'user',
        priority: 5,
        app_token: 'user-token-101',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    }),
  ]);

  // Assign categories to users (user skills/preferences)
  console.log('Assigning categories to users...');
  await Promise.all([
    // John Doe's skills
    prisma.user_category.create({
      data: {
        user_id: users[1].id,
        category_id: subCategories[0].id, // Cleaning
      },
    }),
    prisma.user_category.create({
      data: {
        user_id: users[1].id,
        category_id: subCategories[1].id, // Plumbing
      },
    }),

    // Jane Smith's skills
    prisma.user_category.create({
      data: {
        user_id: users[2].id,
        category_id: subCategories[3].id, // Legal Consultation
      },
    }),
    prisma.user_category.create({
      data: {
        user_id: users[2].id,
        category_id: subCategories[4].id, // Financial Advice
      },
    }),

    // Bob Johnson's skills
    prisma.user_category.create({
      data: {
        user_id: users[3].id,
        category_id: subCategories[7].id, // Food Delivery
      },
    }),
    prisma.user_category.create({
      data: {
        user_id: users[3].id,
        category_id: subCategories[8].id, // Package Delivery
      },
    }),

    // Alice Williams' skills
    prisma.user_category.create({
      data: {
        user_id: users[4].id,
        category_id: subCategories[9].id, // Computer Repair
      },
    }),
    prisma.user_category.create({
      data: {
        user_id: users[4].id,
        category_id: subCategories[10].id, // Smartphone Support
      },
    }),
  ]);

  // Create tasks
  console.log('Creating tasks...');
  const tasks = await Promise.all([
    // Task 1: Cleaning service
    prisma.tasks.create({
      data: {
        city_id: cities[0].id,
        category_id: subCategories[0].id, // Cleaning
        execute_at: '2023-05-15T14:00:00',
        description:
          'Need help cleaning a 2-bedroom apartment after moving out.',
        price_min: 80,
        price_max: 120,
        price_fact: 100,
        comment: 'Please bring your own cleaning supplies.',
        phone: '+1987654321',
        address: '123 Main St, Apt 4B',
        status_id: statuses[2].id, // Completed
        creator_user_id: users[1].id, // John Doe
        performer_user_id: users[2].id, // Jane Smith
        commission: 10,
        city_area: 'Downtown',
        emergency_call: false,
      },
    }),

    // Task 2: Legal consultation
    prisma.tasks.create({
      data: {
        city_id: cities[1].id,
        category_id: subCategories[3].id, // Legal Consultation
        execute_at: '2023-05-20T10:00:00',
        description: 'Need advice on tenant rights and lease agreement review.',
        price_min: 150,
        price_max: 200,
        price_fact: 175,
        comment: 'Will provide all documents in advance.',
        phone: '+1122334455',
        address: '456 Oak Ave, Suite 7',
        status_id: statuses[2].id, // Completed
        creator_user_id: users[3].id, // Bob Johnson
        performer_user_id: users[2].id, // Jane Smith
        commission: 17.5,
        city_area: 'Business District',
        emergency_call: false,
      },
    }),

    // Task 3: Food delivery
    prisma.tasks.create({
      data: {
        city_id: cities[2].id,
        category_id: subCategories[7].id, // Food Delivery
        execute_at: '2023-05-18T18:30:00',
        description: 'Need food delivery from Thai restaurant to home.',
        price_min: 20,
        price_max: 30,
        price_fact: 25,
        comment: 'Please make sure to get extra sauce packets.',
        phone: '+1555666777',
        address: '789 Pine St, Apt 12C',
        status_id: statuses[2].id, // Completed
        creator_user_id: users[4].id, // Alice Williams
        performer_user_id: users[3].id, // Bob Johnson
        commission: 2.5,
        city_area: 'Residential',
        emergency_call: false,
      },
    }),

    // Task 4: Computer repair (in progress)
    prisma.tasks.create({
      data: {
        city_id: cities[3].id,
        category_id: subCategories[9].id, // Computer Repair
        execute_at: '2023-05-25T15:00:00',
        description: 'Laptop not booting up, need diagnostic and repair.',
        price_min: 100,
        price_max: 200,
        price_fact: null, // Not completed yet
        comment: 'It was working fine yesterday, then suddenly stopped.',
        phone: '+1777888999',
        address: '101 Elm St, Unit 3',
        status_id: statuses[1].id, // In Progress
        creator_user_id: users[1].id, // John Doe
        performer_user_id: users[4].id, // Alice Williams
        commission: 15,
        city_area: 'Suburbs',
        emergency_call: true,
      },
    }),

    // Task 5: Plumbing (created, not assigned)
    prisma.tasks.create({
      data: {
        city_id: cities[0].id,
        category_id: subCategories[1].id, // Plumbing
        execute_at: '2023-05-30T09:00:00',
        description: 'Leaking kitchen sink needs repair.',
        price_min: 70,
        price_max: 120,
        price_fact: null, // Not assigned yet
        comment: 'Water is collecting in cabinet under sink.',
        phone: '+1987654321',
        address: '123 Main St, Apt 4B',
        status_id: statuses[0].id, // Created
        creator_user_id: users[1].id, // John Doe
        performer_user_id: null, // Not assigned
        commission: 10,
        city_area: 'Downtown',
        emergency_call: false,
      },
    }),
  ]);

  // Create task history
  console.log('Creating task history...');
  await Promise.all([
    // History for Task 1
    prisma.task_history.create({
      data: {
        task_id: tasks[0].id,
        user_id: users[1].id, // John Doe (creator)
        comment: 'Task created',
        status_id: statuses[0].id, // Created
        created_at: new Date('2023-05-10T09:00:00'),
      },
    }),
    prisma.task_history.create({
      data: {
        task_id: tasks[0].id,
        user_id: users[2].id, // Jane Smith (performer)
        comment: 'Task accepted',
        status_id: statuses[1].id, // In Progress
        created_at: new Date('2023-05-10T10:30:00'),
      },
    }),
    prisma.task_history.create({
      data: {
        task_id: tasks[0].id,
        user_id: users[2].id, // Jane Smith (performer)
        comment: 'Task completed successfully',
        status_id: statuses[2].id, // Completed
        created_at: new Date('2023-05-15T16:45:00'),
      },
    }),

    // History for Task 2
    prisma.task_history.create({
      data: {
        task_id: tasks[1].id,
        user_id: users[3].id, // Bob Johnson (creator)
        comment: 'Task created',
        status_id: statuses[0].id, // Created
        created_at: new Date('2023-05-15T14:00:00'),
      },
    }),
    prisma.task_history.create({
      data: {
        task_id: tasks[1].id,
        user_id: users[2].id, // Jane Smith (performer)
        comment: 'Task accepted',
        status_id: statuses[1].id, // In Progress
        created_at: new Date('2023-05-15T16:20:00'),
      },
    }),
    prisma.task_history.create({
      data: {
        task_id: tasks[1].id,
        user_id: users[2].id, // Jane Smith (performer)
        comment: 'Task completed, documents reviewed',
        status_id: statuses[2].id, // Completed
        created_at: new Date('2023-05-20T11:30:00'),
      },
    }),

    // History for Task 3
    prisma.task_history.create({
      data: {
        task_id: tasks[2].id,
        user_id: users[4].id, // Alice Williams (creator)
        comment: 'Task created',
        status_id: statuses[0].id, // Created
        created_at: new Date('2023-05-18T17:00:00'),
      },
    }),
    prisma.task_history.create({
      data: {
        task_id: tasks[2].id,
        user_id: users[3].id, // Bob Johnson (performer)
        comment: 'Task accepted',
        status_id: statuses[1].id, // In Progress
        created_at: new Date('2023-05-18T17:15:00'),
      },
    }),
    prisma.task_history.create({
      data: {
        task_id: tasks[2].id,
        user_id: users[3].id, // Bob Johnson (performer)
        comment: 'Food delivered',
        status_id: statuses[2].id, // Completed
        created_at: new Date('2023-05-18T19:00:00'),
      },
    }),

    // History for Task 4
    prisma.task_history.create({
      data: {
        task_id: tasks[3].id,
        user_id: users[1].id, // John Doe (creator)
        comment: 'Task created',
        status_id: statuses[0].id, // Created
        created_at: new Date('2023-05-24T10:00:00'),
      },
    }),
    prisma.task_history.create({
      data: {
        task_id: tasks[3].id,
        user_id: users[4].id, // Alice Williams (performer)
        comment: 'Task accepted',
        status_id: statuses[1].id, // In Progress
        created_at: new Date('2023-05-24T11:30:00'),
      },
    }),

    // History for Task 5
    prisma.task_history.create({
      data: {
        task_id: tasks[4].id,
        user_id: users[1].id, // John Doe (creator)
        comment: 'Task created',
        status_id: statuses[0].id, // Created
        created_at: new Date('2023-05-28T08:00:00'),
      },
    }),
  ]);

  // Create balance history
  console.log('Creating balance history...');
  await Promise.all([
    // Balance history for completed tasks
    prisma.balance_history.create({
      data: {
        task_id: tasks[0].id,
        user_id: users[2].id, // Jane Smith (performer)
        reason_id: 1, // Payment for task
        val: 90, // $100 - $10 commission
      },
    }),
    prisma.balance_history.create({
      data: {
        task_id: tasks[1].id,
        user_id: users[2].id, // Jane Smith (performer)
        reason_id: 1, // Payment for task
        val: 157.5, // $175 - $17.5 commission
      },
    }),
    prisma.balance_history.create({
      data: {
        task_id: tasks[2].id,
        user_id: users[3].id, // Bob Johnson (performer)
        reason_id: 1, // Payment for task
        val: 22.5, // $25 - $2.5 commission
      },
    }),

    // System balance adjustments
    prisma.balance_history.create({
      data: {
        user_id: users[1].id, // John Doe
        reason_id: 2, // Initial deposit
        val: 500,
      },
    }),
    prisma.balance_history.create({
      data: {
        user_id: users[2].id, // Jane Smith
        reason_id: 2, // Initial deposit
        val: 300,
      },
    }),
    prisma.balance_history.create({
      data: {
        user_id: users[3].id, // Bob Johnson
        reason_id: 2, // Initial deposit
        val: 200,
      },
    }),
    prisma.balance_history.create({
      data: {
        user_id: users[4].id, // Alice Williams
        reason_id: 2, // Initial deposit
        val: 250,
      },
    }),
  ]);

  // Create FCM tokens
  console.log('Creating FCM tokens...');
  await Promise.all([
    prisma.fcm_token.create({
      data: {
        temporaryKey: 'temp-key-123',
        fcmToken: 'fcm-token-123456',
        userId: users[1].id, // John Doe
      },
    }),
    prisma.fcm_token.create({
      data: {
        temporaryKey: 'temp-key-456',
        fcmToken: 'fcm-token-789012',
        userId: users[2].id, // Jane Smith
      },
    }),
    prisma.fcm_token.create({
      data: {
        temporaryKey: 'temp-key-789',
        fcmToken: 'fcm-token-345678',
        userId: users[3].id, // Bob Johnson
      },
    }),
  ]);

  // Create forms
  console.log('Creating forms...');
  await Promise.all([
    prisma.forms.create({
      data: {
        text: 'Contact us form submission guidelines',
      },
    }),
    prisma.forms.create({
      data: {
        text: 'Task creation form instructions',
      },
    }),
    prisma.forms.create({
      data: {
        text: 'User registration form help text',
      },
    }),
  ]);

  // Create no_application_text
  console.log('Creating no_application_text...');
  await Promise.all([
    prisma.no_application_text.create({
      data: {
        text: 'No applications have been submitted for this task yet.',
      },
    }),
    prisma.no_application_text.create({
      data: {
        text: 'Be the first to apply for this task!',
      },
    }),
  ]);

  console.log('Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
