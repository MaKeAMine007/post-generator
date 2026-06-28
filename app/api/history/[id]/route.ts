import { NextRequest, NextResponse } from "next/server";
import { removeHistoryEntry } from "@/db/queries";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await removeHistoryEntry(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/history/:id]", err);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
