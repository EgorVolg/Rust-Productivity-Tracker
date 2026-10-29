import { useEffect, useState } from "react";
import { Cycle } from "../types";
import { api, CycleInput } from "../api";

/**
 * Создает пустую форму для нового цикла с текущими датой и временем
 * @returns объект CycleInput с дефолтными значениями
 */
function emptyForm(): CycleInput {
    const now = new Date();
    return {
        date: now.toISOString().split("T")[0],
        hour: now.getHours(),
        color: "#facc15",
        category: "",
        topic: "",
        minutes: 50,
        energy: 5,
    };
}

/**
 * Создает форму на основе последнего цикла (для копирования)
 * @param last - последний цикл для копирования
 * @returns объект CycleInput с данными из последнего цикла
 */
function fromLastCycle(last: Cycle): CycleInput {
    const now = new Date();
    return {
        date: now.toISOString().split("T")[0],
        hour: now.getHours(),
        color: last.color,
        category: last.category,
        topic: last.topic,
        minutes: 50,
        energy: 5,
    };
}

interface CycleManagerArgs {
  journal: { cycles: Cycle[] } | null;
  reload: () => Promise<void>;
  notify: (msg: string) => void;
}

/**
 * Хук для управления циклами (добавление, редактирование, удаление, копирование)
 * Автоматически префиллит форму на основе последнего цикла
 * @param args - параметры хука (журнал, функция перезагрузки, функция уведомлений)
 * @returns объект с методами и состоянием для управления циклами
 */
export function useCycleManager({ journal, reload, notify }: CycleManagerArgs) {
    const [formData, setFormData] = useState<CycleInput>(emptyForm);
    const [userEdited, setUserEdited] = useState(false);
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [version, setVersion] = useState(0);

    // Реактивный префилл: после загрузки journal и после add/delete
    useEffect(() => {
        if (userEdited) return;
        const last = journal?.cycles.at(-1);
        if (last) setFormData(fromLastCycle(last));
    }, [journal, userEdited]);

    function openAdd() {
        const last = journal?.cycles.at(-1);
        setFormData(last ? fromLastCycle(last) : emptyForm());
        setMode("add");
        setEditingId(null);
        setUserEdited(false);
        setVersion((v) => v + 1);
        setOpen(true);
    }

    function openEdit(cycle: Cycle) {
        setFormData({
            date: cycle.date,
            hour: cycle.hour,
            color: cycle.color,
            category: cycle.category,
            topic: cycle.topic,
            minutes: cycle.minutes,
            energy: cycle.energy,
        });
        setMode("edit");
        setEditingId(cycle.id);
        setUserEdited(true);
        setVersion((v) => v + 1);
        setOpen(true);
    }

    // Вызывается диалогом после успешного api.add/edit
    async function onSaved() {
        const wasEdit = mode === "edit";
        try {
            await reload();
            if (!wasEdit) setUserEdited(false);
            notify(wasEdit ? "Цикл изменён" : "Цикл добавлен");
        } catch (err) {
            console.error("[cycle] reload failed:", err);
            notify("Не удалось обновить данные");
        } finally {
            setOpen(false);
            setMode("add");
            setEditingId(null);
        }
    }

    async function copy(id: string) {
        const cycle = journal?.cycles.find((c) => c.id === id);
        if (!cycle) return;
        const now = new Date();
        const payload: CycleInput = {
            date: now.toISOString().split("T")[0],
            hour: now.getHours(),
            color: cycle.color,
            category: cycle.category,
            topic: cycle.topic,
            minutes: cycle.minutes,
            energy: cycle.energy,
        };
        try {
            await api.addCycle(payload);
            await reload();
            setUserEdited(false);
            notify("Цикл добавлен");
        } catch (err) {
            console.error("[cycle] copy failed:", err);
            notify("Не удалось скопировать цикл");
        }
    }

    async function remove(id: string) {
        try {
            await api.deleteCycle(id);
            await reload();
            setUserEdited(false);
            notify("Цикл удалён");
        } catch (err) {
            console.error("[cycle] delete failed:", err);
            notify("Не удалось удалить цикл");
        }
    }

    return {
        formData,
        mode,
        editingId,
        open,
        version,
        setOpen,
        openAdd,
        openEdit,
        onSaved,
        copy,
        remove,
    };
}