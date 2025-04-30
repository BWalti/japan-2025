import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function useTimezoneTime(timezone: string): { time: Ref<string> } {
    const time = ref<string>('');

    let intervalId: number | undefined;

    const updateTime = () => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        time.value = now.toLocaleTimeString('en-US', options);
    };

    onMounted(() => {
        updateTime();
        intervalId = window.setInterval(updateTime, 1000);
    });

    onUnmounted(() => {
        if (intervalId !== undefined) {
            clearInterval(intervalId);
        }
    });

    return {
        time,
    };
}
