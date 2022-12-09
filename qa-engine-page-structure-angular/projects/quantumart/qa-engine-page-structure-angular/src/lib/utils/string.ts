export function trim(input: string | undefined, char?: string): string {
    if (!input) {
        return '';
    }

    if (!char) {
        return input.trim();
    }

    const first = [...input].findIndex(ch => ch !== char);
    if (first === -1) {
        return '';
    }

    const last = [...input].reverse().findIndex(ch => ch !== char);

    return input.substring(first, input.length - last);
}

export function lowerFirstLetter(input: string): string {
    return input ? input.charAt(0).toLowerCase() + input.slice(1) : input;
}

export function trimFirstByCharacter(input: string, charToRemove: string): string {
    return input && input.startsWith(charToRemove) ? input.slice(1) : input;
}

export function removeHtmlTagsWithContent(source: string): string {
    if (!source) {
        return source;
    }

    return source.replace(/<[^>]*?>[^>]*?<\/[^>]*?>/g, '').trim();
}
