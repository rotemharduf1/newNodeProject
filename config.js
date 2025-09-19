import { pathToFileURL } from "url";

export function getConfig() {
    const name = process.env.name ?? process.env.NAME ?? "";
    const env = process.env.env ?? process.env.ENV ?? "";
    const portRaw = process.env.port ?? process.env.PORT;
    const port = portRaw !== undefined ? Number(portRaw) : undefined;
    const username = process.env.username ?? process.env.USERNAME ?? "";

    return {
        name,
        env,
        port: Number.isNaN(port) ? undefined : port,
        username,
    };
}

function printConfig() {
    const now = new Date().toISOString();
    console.log(`[${now}]`, getConfig());
}

//not necessarily relevant
const isDirectRun = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
    printConfig();
    setInterval(printConfig, 5000);
}
