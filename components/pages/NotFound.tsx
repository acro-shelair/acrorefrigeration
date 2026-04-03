"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  // Extract the slug from the current path (e.g. "/old-blog-slug" → "old-blog-slug")
  const slug = pathname.replace(/^\//, "").split("/")[0];
  const isTopLevelSlug =
    slug &&
    ![
      "resources",
      "services",
      "industries",
      "brands",
      "projects",
      "locations",
      "admin",
      "contact",
      "pricing",
      "about",
      "terms",
      "privacy",
    ].includes(slug);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <motion.div
        className="max-w-md text-center"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h1
          className="mb-4 text-4xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          404
        </motion.h1>
        <motion.p
          className="mb-4 text-xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          Oops! Page not found
        </motion.p>

        {isTopLevelSlug && (
          <motion.div
            className="mb-6 rounded-lg border bg-background p-4 text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <p className="mb-3 text-sm text-muted-foreground">
              Our website has been updated. This page may have moved to one of
              these locations:
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/resources/${slug}`}
                  className="text-primary underline hover:text-primary/90"
                >
                  /resources/{slug}
                </Link>
              </li>
              <li>
                <Link
                  href={`/services/${slug}`}
                  className="text-primary underline hover:text-primary/90"
                >
                  /services/{slug}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: isTopLevelSlug ? 0.5 : 0.4 }}
        >
          <Link
            href="/"
            className="text-primary underline hover:text-primary/90"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
