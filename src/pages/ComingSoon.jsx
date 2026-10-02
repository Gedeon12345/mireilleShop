import { Hammer } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

export default function ComingSoon({ title }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState icon={Hammer} title="Écran prévu en phase 2" text="Il sera développé après validation du tableau de bord et de l’inventaire." />
    </>
  )
}
