"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CiLocationArrow1 } from "react-icons/ci";
import {
  IoIosArrowDropdown,
  IoIosArrowDropup,
} from "react-icons/io";
import { PiGitMergeDuotone } from "react-icons/pi";

import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export default function OpenSourceSection() {
  const totalPRs = useMemo(() => {
    return DATA.openSource.reduce(
      (total, repo) => total + repo.prs.length,
      0,
    );
  }, []);

  return (
    <section id="open-source">
      <div className="flex min-h-0 flex-col gap-y-8">
        {/* Section heading */}
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />

            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">
                Open Source
              </span>
            </div>

            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>

          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Contributing to open source
            </h2>

            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              I contribute features, fixes, performance improvements, and
              developer experience improvements to open-source projects.
            </p>
          </div>
        </div>

        {/* Contributions */}
        <div className="max-w-200 mx-auto w-full">
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-2xl md:text-[28px] font-semibold tracking-wide leading-tight mb-1">
                Open Source
              </h3>

              <span className="inline-flex items-center border border-current/20 rounded-full px-3 py-1 text-[11px] md:text-xs opacity-75 font-medium whitespace-nowrap">
                {totalPRs} PRs
              </span>
            </div>

            <OpenSourceSummary />

            <Link
              href="https://github.com/BharadwajKanneveti"
              target="_blank"
              rel="noopener noreferrer"
              className="underline flex items-center justify-center gap-1 text-xs md:text-sm font-medium pt-2 md:pt-4 mt-2 md:mt-4 border-t border-white/10 pb-2 md:pb-4 mb-2 md:mb-4"
            >
              GitHub
              <CiLocationArrow1 className="inline-block ml-0.5 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function OpenSourceSummary() {
  const [openRepo, setOpenRepo] = useState<number | null>(null);

  const contentRefs = useRef<
    Record<number, HTMLDivElement | null>
  >({});

  const [maxHeights, setMaxHeights] = useState<
    Record<number, string>
  >({});

  /*
   * IMPORTANT:
   * Do NOT sort these.
   *
   * The order in DATA.openSource is intentional:
   *
   * Conduit
   * ansvisor
   * redential-cli
   * CraftBot
   * OpenUI
   * DecisionGo
   *
   * Conduit is first because PR #331 is the contribution
   * you specifically want highlighted first.
   */
  const repos = useMemo(() => {
    return DATA.openSource;
  }, []);

  useEffect(() => {
    const updateHeights = () => {
      const newHeights: Record<number, string> = {};

      repos.forEach((_, idx) => {
        const element = contentRefs.current[idx];

        if (!element) {
          newHeights[idx] = "0px";
          return;
        }

        if (openRepo === idx) {
          newHeights[idx] = `${element.scrollHeight}px`;
        } else {
          newHeights[idx] = "0px";
        }
      });

      setMaxHeights(newHeights);
    };

    updateHeights();

    window.addEventListener("resize", updateHeights);

    return () => {
      window.removeEventListener("resize", updateHeights);
    };
  }, [openRepo, repos]);

  const toggleRepo = (idx: number) => {
    setOpenRepo((current) => (current === idx ? null : idx));
  };

  return (
    <div className="mt-1">
      {repos.map((repo, idx) => {
        const isOpen = openRepo === idx;

        return (
          <BlurFade
            key={repo.name}
            delay={BLUR_FADE_DELAY * 12 + idx * 0.05}
          >
            <div>
              {/* Repository row */}
              <button
                type="button"
                onClick={() => toggleRepo(idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-1 py-1 rounded-sm cursor-pointer hover:bg-accent-foreground/10 transition-colors"
              >
                <div className="flex items-center justify-start gap-2">
                  <p className="font-medium text-md">
                    {repo.name}
                  </p>

                  <span className="text-[10px] opacity-70 mt-0.5">
                    {repo.prs.length}{" "}
                    {repo.prs.length === 1 ? "PR" : "PRs"}
                  </span>
                </div>

                <span>
                  {isOpen ? (
                    <IoIosArrowDropup className="h-5 w-5" />
                  ) : (
                    <IoIosArrowDropdown className="h-5 w-5" />
                  )}
                </span>
              </button>

              {/* PR list */}
              <div
                ref={(element) => {
                  contentRefs.current[idx] = element;
                }}
                style={{
                  maxHeight: maxHeights[idx] ?? "0px",
                  transition: "max-height 300ms ease",
                }}
                className="overflow-hidden"
              >
                <div className="p-2 flex flex-col items-start gap-1.5 text-sm md:text-base">
                  {repo.prs.map((pr, prIdx) => (
                    <div
                      key={pr.url}
                      className={`flex items-center gap-2 transform transition-all duration-300 ${
                        isOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2"
                      }`}
                      style={{
                        transitionDelay: `${prIdx * 40}ms`,
                      }}
                    >
                      <PiGitMergeDuotone className="h-4 w-4 flex-none" />

                      <Link
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-xs hover:opacity-70 transition-opacity"
                      >
                        {pr.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BlurFade>
        );
      })}
    </div>
  );
}