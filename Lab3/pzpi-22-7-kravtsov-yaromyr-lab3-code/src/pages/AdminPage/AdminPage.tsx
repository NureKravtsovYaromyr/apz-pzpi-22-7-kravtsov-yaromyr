import styles from './AdminPage.module.css'
import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import $api from '../../app/api/http'
import { IZone } from '../../models/IZone'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const AdminPage: React.FC = () => {
    const [hourlyData, setHourlyData] = useState<number[]>(Array(24).fill(0))
    const [topZones, setTopZones] = useState<{ name: string; count: number }[]>([])
    const [weeklyData, setWeeklyData] = useState<{ date: string; count: number }[]>([])

    useEffect(() => {
        // 1) Відкриття дверей за годинами (сьогодні)
        const fetchHourly = async () => {
            const today = new Date().toISOString().slice(0, 10)
            const res = await $api.get<any[]>('/door-logs', { params: { date_from: today, date_to: today } })
            const counts = Array(24).fill(0)
            res.data.forEach(log => {
                const hour = new Date(log.timestamp).getHours()
                counts[hour]++
            })
            setHourlyData(counts)
        }

        const fetchTopZones = async () => {
            const { data: zones } = await $api.get<IZone[]>('/zones')
            const usage = await Promise.all(
                zones.map(async z => {
                    const r = await $api.get<number>(`/zones/${z.id}/usage`)
                    return { name: z.name, count: r.data }
                })
            )
            usage.sort((a, b) => b.count - a.count)
            setTopZones(usage.slice(0, 5))
        }

        const fetchWeekly = async () => {
            const to = new Date()
            const from = new Date()
            from.setDate(to.getDate() - 6)
            const fromStr = from.toISOString().slice(0, 10)
            const toStr = to.toISOString().slice(0, 10)
            const res = await $api.get<any[]>('/door-logs', { params: { date_from: fromStr, date_to: toStr } })
            const map: Record<string, number> = {}
            for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
                map[d.toISOString().slice(0, 10)] = 0
            }
            res.data.forEach(log => {
                const day = log.timestamp.slice(0, 10)
                if (map[day] !== undefined) map[day]++
            })
            setWeeklyData(Object.entries(map).map(([date, count]) => ({ date, count })))
        }

        fetchHourly()
        fetchTopZones()
        fetchWeekly()
    }, [])

    return (
        <div style={{ padding: 20 }} className={styles.main}>
            <div>
                <h2>Відкриття дверей за годинами (сьогодні)</h2>
                <Bar
                    data={{
                        labels: hourlyData.map((_, i) => `${i}:00`),
                        datasets: [{ label: 'Відкриттів', data: hourlyData }],
                    }}
                />
            </div>
            <div>
                <h2>Топ-5 найбільш завантажених зон</h2>
                <Bar
                    data={{
                        labels: topZones.map(z => z.name),
                        datasets: [{ label: 'Кількість відкриттів', data: topZones.map(z => z.count) }],
                    }}
                    options={{ indexAxis: 'y' }}
                />
            </div>
            <div>
                <h2>Глобальна активність за 7 днів</h2>
                <Line
                    data={{
                        labels: weeklyData.map(w => w.date),
                        datasets: [
                            {
                                label: 'Відкриттів',
                                data: weeklyData.map(w => w.count),
                                fill: false,
                            },
                        ],
                    }}
                />
            </div>
        </div>
    )
}

export default AdminPage
