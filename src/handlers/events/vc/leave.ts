import { VoiceState } from "discord.js";
import botConfig from "../../../../bot.config";

const handleVcLeave = (async (oldState: VoiceState, newState: VoiceState) => {
    if (!oldState.channel) return;
    const channel = oldState.channel;
    if (channel.parent?.id !== botConfig.voice.customCategoryId) return;
    if (channel.id === botConfig.voice.customChannelId) return;
    if (botConfig.voice.protectChannelIds.includes(channel.id)) return;

    console.log(`Voice channel ${channel.id} is empty. Deleting...`);

    if (channel.members.size === 0) {
        try {
            await channel.delete();
        } catch (error) {
            console.error("vc-leave: チャンネル削除に失敗しました:", error);

            if (!process.env.WEBHOOK_URL) return;

            try {
                await fetch(process.env.WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: `vc-leave: チャンネル削除に失敗しました: ${String(error)}`,
                    }),
                });
            } catch (webhookError) {
                console.error("vc-leave: Webhook送信に失敗しました:", webhookError);
            }
        }
    }
});

export { handleVcLeave };
