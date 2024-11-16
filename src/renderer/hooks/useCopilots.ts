import { useState, useEffect } from 'react'
import * as remote from '../packages/remote'
import { CopilotDetail } from '../../shared/types'
import { useAtom } from 'jotai'
import { myCopilotsAtom } from '../stores/atoms'

export function useMyCopilots() {
    const [copilots, setCopilots] = useAtom(myCopilotsAtom)

    const addOrUpdate = (target: CopilotDetail) => {
        setCopilots(async (copilots) => {
            let found = false
            const newCopilots = (await copilots).map((c: CopilotDetail) => {
                if (c.id === target.id) {
                    found = true
                    return target
                }
                return c
            })
            if (!found) {
                newCopilots.push(target)
            }
            return newCopilots
        })
    }

    const remove = (id: string) => {
        setCopilots(async (copilots) => (await copilots).filter((c) => c.id !== id))
    }

    return {
        copilots,
        addOrUpdate,
        remove,
    }
}

export function useRemoteCopilots(lang: string, windowOpen: boolean) {
    const [copilots, _setCopilots] = useState<CopilotDetail[]>([])
    useEffect(() => {
        if (windowOpen) {
            remote.listCopilots(lang).then((copilots) => {
                _setCopilots(copilots)
            })
        }
    }, [lang, windowOpen])
    return { copilots }
}
