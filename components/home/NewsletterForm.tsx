import React from "react";

type Props = {};

function NewsletterForm({}: Props) {
  return (
    <form
      className="flex flex-col mt-6 w-full"
      // onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex gap-4 items-start w-full text-base">
        <label htmlFor="email" className="sr-only">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="flex-1 shrink gap-2 self-stretch p-3 border border-black border-solid basis-6 min-w-[240px]"
          placeholder="Your Email Here"
          aria-label="Your Email Here"
        />
        <button
          type="submit"
          className="gap-2 self-stretch px-6 py-3 text-black whitespace-nowrap border border-black border-solid w-[119px] max-md:px-5"
        >
          Join
        </button>
      </div>
      <div className="mt-3 text-xs text-black">
        By joining, you accept our Privacy Policy and agree to receive updates.
      </div>
    </form>
  );
}

export default NewsletterForm;
