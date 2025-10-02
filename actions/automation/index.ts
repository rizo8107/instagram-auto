"use server";

import { onCurrentUser } from "../user";
import { findUser } from "../user/queries";
import {
  addKeyWords,
  addListener,
  addPosts,
  addTrigger,
  createAutomation,
  deleteKeywordsQuery,
  findAutomation,
  getAutomation,
  updateAutomation,
} from "./queries";

export const createAutomations = async (id?: string) => {
  const user = await onCurrentUser();

  try {
    const create = await createAutomation(user.id, id);

    if (create) return { status: 200, data: "Automation created" };
    return { status: 404, data: "Failed to create automation" };
  } catch (error: any) {
    return { status: 500, data: error.message };
  }
};

export const getAllAutomation = async () => {
  const user = await onCurrentUser();

  try {
    const getAll = await getAutomation(user.id);

    if (getAll) return { status: 200, data: getAll.automations || [] };

    return { status: 404, data: [] };
  } catch (error: any) {
    return { status: 500, data: [] };
  }
};

export const getAutomationInfo = async (id: string) => {
  await onCurrentUser();

  try {
    const automation = await findAutomation(id);

    if (automation) return { status: 200, data: automation };

    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const updateAutomationName = async (
  automationId: string,
  data: {
    name?: string;
    active?: boolean;
    automation?: string;
  }
) => {
  await onCurrentUser();

  try {
    const update = await updateAutomation(automationId, data);

    if (update) return { status: 200, data: "Automation updated" };
    return { status: 404, data: "Failed to update automation" };
  } catch (error) {
    return { status: 500, data: "Failed to update automation" };
  }
};

export const saveListener = async (
  automationId: string,
  listener: "SMARTAI" | "MESSAGE",
  prompt: string,
  reply?: string
) => {
  await onCurrentUser();

  try {
    const create = await addListener(automationId, listener, prompt, reply);

    if (create) return { status: 200, data: "Listener created" };
    return { status: 404, data: "Failed to create listener" };
  } catch (error) {
    return { status: 500, data: "Failed to save listener" };
  }
};

export const saveTrigger = async (automationId: string, trigger: string[]) => {
  await onCurrentUser();

  try {
    const create = await addTrigger(automationId, trigger);

    if (create) return { status: 200, data: "Trigger created" };
    return { status: 404, data: "Failed to create trigger" };
  } catch (error) {
    return { status: 500, data: "Failed to save trigger" };
  }
};

export const saveKeywords = async (automationId: string, keywords: string) => {
  await onCurrentUser();

  try {
    const create = await addKeyWords(automationId, keywords);

    if (create) return { status: 200, data: "Keywords created" };
    return { status: 404, data: "Failed to create keywords" };
  } catch (error) {
    return { status: 500, data: "Failed to save keywords" };
  }
};

export const deleteKeywords = async (automationId: string) => {
  await onCurrentUser();

  try {
    const deleted = await deleteKeywordsQuery(automationId);
    if (deleted) {
      return { status: 200, data: "Keywords deleted" };
    }
    return { status: 404, data: "Failed to delete keywords" };
  } catch (error) {
    return { status: 500, data: "Failed to delete keywords" };
  }
};

export const getProfilePosts = async () => {
  const user = await onCurrentUser();

  try {
    const profile = await findUser(user.id);
    const posts = await fetch(
      `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_url,media_type,timestamp&limit=10&access_token=${profile?.integrations[0].token}`
    );

    const parsed = await posts.json();

    if (parsed) return { status: 200, data: parsed };
    console.log("🚀 ~ getProfilePosts ~ error");
    return { status: 404 };
  } catch (error: any) {
    console.log("🚀 ~ getProfilePosts ~ error:", error.message);

    return { status: 500 };
  }
};

export const savePosts = async (
  automationId: string,
  posts: {
    postid: string;
    caption?: string;
    media: string;
    mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM";
  }[]
) => {
  await onCurrentUser();

  try {
    const create = await addPosts(automationId, posts);

    if (create) return { status: 200, data: "Posts created" };
    return { status: 404, data: "Failed to create posts" };
  } catch (error) {
    return { status: 500, data: "Failed to save posts" };
  }
};

export const activateAutomation = async (id: string, status: boolean) => {
  await onCurrentUser();

  try {
    const activate = await updateAutomation(id, { active: status });
    if (activate) {
      return {
        status: 200,
        data: `Automation ${status ? "activated" : "deactivated"}`,
      };
    }
    return { status: 404, data: "Failed to activate automation" };
  } catch (error) {
    return { status: 500, data: "Failed to activate automation" };
  }
};
