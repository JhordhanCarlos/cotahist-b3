import { runDailyJob } from '@/lib/job'

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        await runDailyJob()
        return Response.json({ ok: true })
    } catch (error) {
        console.error('[cron] runDailyJob failed:', error)
        const message = error instanceof Error ? error.message : 'Erro desconhecido'
        return Response.json({ ok: false, error: message }, { status: 500 })
    }
}