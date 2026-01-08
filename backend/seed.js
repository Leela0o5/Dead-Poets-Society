import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Poem from "./models/Poem.js";
import Review from "./models/Review.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to Database
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to Database...");

    // Clear existing data (Fresh Start)
    await User.deleteMany({});
    await Poem.deleteMany({});
    await Review.deleteMany({});
    console.log("Database cleared.");

    //  Create Users with Cartoon Avatars
    // We explicitly set the profilePicture URL here to ensure they get the "Notionists" style
    const users = await User.create([
      {
        username: "walt_whitman",
        email: "walt@leaves.com",
        password: "password123",
        bio: "I celebrate myself, and sing myself.",
        profilePicture:
          "https://api.dicebear.com/7.x/notionists/svg?seed=walt_whitman&backgroundColor=e6e6e6",
      },
      {
        username: "emily_dickinson",
        email: "emily@hope.com",
        password: "password123",
        bio: "Hope is the thing with feathers.",
        profilePicture:
          "https://api.dicebear.com/7.x/notionists/svg?seed=emily_dickinson&backgroundColor=ffdfbf",
      },
      {
        username: "edgar_allan_poe",
        email: "raven@nevermore.com",
        password: "password123",
        bio: "Dreaming dreams no mortal ever dared to dream before.",
        profilePicture:
          "https://api.dicebear.com/7.x/notionists/svg?seed=edgar_allan_poe&backgroundColor=c0aede",
      },
      {
        username: "modern_coder",
        email: "code@verse.com",
        password: "password123",
        bio: "Writing poetry in Javascript.",
        profilePicture:
          "https://api.dicebear.com/7.x/notionists/svg?seed=modern_coder&backgroundColor=b6e3f4",
      },
    ]);

    const [walt, emily, edgar, dev] = users;
    console.log("Users created with avatars.");

    // Create Poems
    const poems = await Poem.create([
      {
        title: "O Captain! My Captain!",
        content:
          "O Captain! my Captain! our fearful trip is done,\nThe ship has weather’d every rack, the prize we sought is won,\nThe port is near, the bells I hear, the people all exulting,\nWhile follow eyes the steady keel, the vessel grim and daring;",
        author: walt._id,
        tags: ["sadness", "nature", "life"],
        visibility: true,
        likes: [emily._id, dev._id],
        createdAt: new Date("2023-11-01"),
      },
      {
        title: "Song of Myself",
        content:
          "I celebrate myself, and sing myself,\nAnd what I assume you shall assume,\nFor every atom belonging to me as good belongs to you.\n\nI loafe and invite my soul,\nI lean and loafe at my ease observing a spear of summer grass.",
        author: walt._id,
        tags: ["abstract", "life"],
        visibility: true,
        createdAt: new Date("2023-11-05"),
      },
      {
        title: "Hope is the thing with feathers",
        content:
          "Hope is the thing with feathers -\nThat perches in the soul -\nAnd sings the tune without the words -\nAnd never stops - at all -",
        author: emily._id,
        tags: ["abstract", "nature", "love"],
        visibility: true,
        likes: [walt._id, edgar._id, dev._id],
        createdAt: new Date("2023-11-10"),
      },
      {
        title: "I'm Nobody! Who are you?",
        content:
          "I'm Nobody! Who are you?\nAre you - Nobody - too?\nThen there's a pair of us!\nDon't tell! they'd advertise - you know!",
        author: emily._id,
        tags: ["life", "identity"],
        visibility: true,
        createdAt: new Date("2023-11-12"),
      },
      {
        title: "The Raven",
        content:
          "Once upon a midnight dreary, while I pondered, weak and weary,\nOver many a quaint and curious volume of forgotten lore—\nWhile I nodded, nearly napping, suddenly there came a tapping,\nAs of some one gently rapping, rapping at my chamber door.",
        author: edgar._id,
        tags: ["sadness", "mystery"],
        visibility: true,
        likes: [walt._id],
        createdAt: new Date("2023-10-31"),
      },
      {
        title: "Console.log(Love)",
        content:
          "const feelings = new Array();\nwhile(alive) {\n  feelings.push('you');\n}\n// Stack overflow error of the heart",
        author: dev._id,
        tags: ["tech", "love", "haiku"],
        visibility: true,
        createdAt: new Date("2023-12-01"),
      },
    ]);

    console.log("Poems created.");

    //  Create Reviews (Feedback)
    await Review.create([
      {
        poem: poems[0]._id, // O Captain
        author: emily._id,
        rating: 5,
        comment:
          "Simply heartbreaking and beautiful. The imagery of the ship is vivid.",
      },
      {
        poem: poems[0]._id,
        author: edgar._id,
        rating: 4,
        comment:
          "A bit too optimistic for my taste, but the structure is undeniable.",
      },
      {
        poem: poems[4]._id, // The Raven
        author: walt._id,
        rating: 5,
        comment: "Dark, rhythmic, and absolutely relentless. A masterpiece.",
      },
      {
        poem: poems[5]._id,
        user: emily._id,
        rating: 3,
        comment:
          "I do not understand the language, but the emotion feels infinite.",
      },
    ]);

    const allPoems = await Poem.find();
    for (const poem of allPoems) {
      const reviews = await Review.find({ poem: poem._id });
      if (reviews.length > 0) {
        poem.reviews = reviews.map((r) => r._id);
        await poem.save();
      }
    }

    console.log(" Reviews linked.");
    console.log(" Database successfully populated with Avatars!");
    process.exit();
  } catch (error) {
    console.error(" Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
