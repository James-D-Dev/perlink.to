import { BioRepository, editableBioPage } from '../../../../repositories/bioRepository'
import { requireOwnedSite } from '../../../../utils/ownedSite'

// Throw away unpublished edits and go back to the live version
export default defineEventHandler(async (event) => {
  const bioPage = await requireOwnedSite(event)
  const bioRepo = new BioRepository(event)
  await bioRepo.clearDraft(bioPage.id)
  const live = await bioRepo.findById(bioPage.id)
  return { success: true, bioPage: editableBioPage({ ...live!, draft: null }) }
})
