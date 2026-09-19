"use client";

import { motion, MotionConfig } from "framer-motion";
import ProjectCoverflow from "@/components/ProjectCoverflow";
import SocialBoardingPass from "@/components/SocialBoardingPass";
import { EASE, DUR } from "@/lib/motion";

interface Project {
  name: string;
  image: string;
  description?: string;
  imagePosition?: string;
  tags?: string[];
  variant?: "image" | "website";
  slug?: string;
  year?: string;
  client?: string;
}

interface Social {
  name: string;
  url: string;
}

interface Block {
  title: string;
  description: string;
  items: string[];
  backgroundImage?: string;
  href?: string;
  projects?: Project[];
  socials?: Social[];
}

interface BentoGridProps {
  blocks: Block[];
  sectionId?: string;
}

/* ── Framer-motion reveal variants ── */
const revealVariants = {
  hidden: {
    opacity: 0.16,
    y: 24,
    scale: 0.99,
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DUR[4],
      ease: EASE,
      delay,
    },
  }),
};

export default function BentoGrid({ blocks, sectionId }: BentoGridProps) {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id={sectionId}
        className="px-5 pt-10 pb-12 scroll-mt-28 md:px-12 md:pt-16 md:pb-12 md:scroll-mt-36"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 md:gap-9" style={{ overflow: "visible" }}>
            {blocks[0]?.projects && (
              <motion.div
                variants={revealVariants}
                initial="visible"
                whileInView="visible"
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                custom={0}
              >
                <ProjectCoverflow projects={blocks[0].projects} />
              </motion.div>
            )}

            <SocialBoardingPass socials={blocks[1]?.socials ?? []} />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
