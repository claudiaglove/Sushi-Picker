import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChoiceGroup } from '../components/ChoiceGroup'
import { buttonClass } from '../components/ui'
import { BUDGET_OPTIONS, WHERE_OPTIONS, WHO_OPTIONS } from '../lib/format'
import type { Budget, Where, Who } from '../types'

export function Pick() {
  const navigate = useNavigate()
  const [budget, setBudget] = useState<Budget | null>(null)
  const [who, setWho] = useState<Who | null>(null)
  const [where, setWhere] = useState<Where | null>(null)
  const ready = budget !== null && who !== null && where !== null

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (!ready) return
        void navigate(`/result?${new URLSearchParams({ budget, who, where }).toString()}`)
      }}
    >
      <h1 className="text-2xl font-extrabold tracking-tight">
        What are you in the mood for?
      </h1>
      <ChoiceGroup
        legend="Budget"
        options={BUDGET_OPTIONS}
        value={budget}
        onChange={setBudget}
      />
      <ChoiceGroup
        legend="Who's coming?"
        options={WHO_OPTIONS}
        value={who}
        onChange={setWho}
      />
      <ChoiceGroup
        legend="How far?"
        options={WHERE_OPTIONS}
        value={where}
        onChange={setWhere}
      />
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          className={buttonClass('primary', 'min-h-14 text-lg')}
          disabled={!ready}
        >
          Pick for me
        </button>
        {!ready && (
          <p className="text-center text-sm text-muted">Tap one answer in each group.</p>
        )}
      </div>
    </form>
  )
}
