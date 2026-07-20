import { useMemo, useState } from "react";

import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Clock3,
  Code2,
  Palette,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";

const courses = [
  {
    title: "Complete React Development",
    category: "Development",
    level: "Intermediate",
    lessons: 48,
    duration: "14 hours",
    rating: 4.9,
    students: "12.4K",
    icon: Code2,
    className: "catalog-blue",
  },
  {
    title: "Python for Data Science",
    category: "Data Science",
    level: "Beginner",
    lessons: 52,
    duration: "16 hours",
    rating: 4.8,
    students: "18.2K",
    icon: BrainCircuit,
    className: "catalog-purple",
  },
  {
    title: "Modern UI/UX Design",
    category: "Design",
    level: "Beginner",
    lessons: 36,
    duration: "10 hours",
    rating: 4.7,
    students: "9.5K",
    icon: Palette,
    className: "catalog-pink",
  },
  {
    title: "Java Data Structures",
    category: "Development",
    level: "Advanced",
    lessons: 61,
    duration: "22 hours",
    rating: 4.9,
    students: "8.1K",
    icon: BookOpen,
    className: "catalog-orange",
  },
];

function ExploreCourses() {
  const [searchText, setSearchText] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const categories = [
    "All",
    "Development",
    "Data Science",
    "Design",
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          );

      const matchesCategory =
        category === "All" ||
        course.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [searchText, category]);

  return (
    <div className="application-page">
      <header className="application-page-header">
        <div>
          <span className="application-eyebrow">
            COURSE LIBRARY
          </span>

          <h1>Explore Courses</h1>

          <p>
            Discover structured courses or use AI
            to create your own learning path.
          </p>
        </div>

        <button
          type="button"
          className="application-primary-button"
        >
          Generate with AI
          <ArrowRight size={17} />
        </button>
      </header>

      <section className="explore-search-panel">
        <div className="explore-search-input">
          <Search size={19} />

          <input
            type="search"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search by course name, skill or topic..."
          />
        </div>

        <div className="course-category-tabs">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={
                category === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="featured-learning-banner">
        <div>
          <span>
            <TrendingUp size={15} />
            TRENDING THIS WEEK
          </span>

          <h2>
            Master full-stack development with a
            structured roadmap
          </h2>

          <p>
            Build real applications using React,
            Node.js, APIs and databases.
          </p>

          <button type="button">
            View Learning Path
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="featured-banner-stat">
          <strong>24</strong>
          <span>Modules</span>
        </div>
      </section>

      <div className="catalog-result-row">
        <div>
          <h2>Recommended courses</h2>

          <p>
            {filteredCourses.length} courses found
          </p>
        </div>

        <select defaultValue="popular">
          <option value="popular">
            Most popular
          </option>
          <option value="rating">
            Highest rated
          </option>
          <option value="newest">
            Recently added
          </option>
        </select>
      </div>

      <section className="course-catalog-grid">
        {filteredCourses.map((course) => {
          const Icon = course.icon;

          return (
            <article
              className="course-catalog-card"
              key={course.title}
            >
              <div
                className={`course-catalog-cover ${course.className}`}
              >
                <Icon size={38} />

                <span>{course.level}</span>
              </div>

              <div className="course-catalog-body">
                <small>{course.category}</small>

                <h3>{course.title}</h3>

                <div className="course-rating-row">
                  <Star
                    size={14}
                    fill="currentColor"
                  />

                  <strong>{course.rating}</strong>
                  <span>
                    ({course.students} learners)
                  </span>
                </div>

                <div className="course-catalog-meta">
                  <span>
                    <BookOpen size={14} />
                    {course.lessons} lessons
                  </span>

                  <span>
                    <Clock3 size={14} />
                    {course.duration}
                  </span>
                </div>

                <button type="button">
                  View Course
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default ExploreCourses;